import React, { useEffect, useState } from 'react';
import '../../../styles/pages/studentInfo/courseHistory/CourseHistory.css';
import { fetchRegisteredClasses, RegisteredClassInfo } from '../../../services/apis/classRegistrationAPI';
import { fetchCourseByCode, Course } from '../../../services/apis/courseAPI';
import { fetchSemesters, Semester } from '../../../services/apis/semesterAPI';
import { useNavigate } from 'react-router-dom';

interface CourseHistoryItem {
  courseId: string;
  courseName: string;
  registerDate: string;
  fee: string;
  status: string;
  classCode: string;
  academicYear: string;
}

const CourseHistory = () => {
  const [courseHistory, setCourseHistory] = useState<CourseHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<CourseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const navigate = useNavigate();

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', ' -');
  };

  const formatCurrency = (amount: string): string => {
    const number = parseFloat(amount).toFixed(0);
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        if (!userId) {
          throw new Error('Không tìm thấy thông tin người dùng');
        }

        // Fetch semesters
        const semesterData = await fetchSemesters();
        setSemesters(semesterData);

        // Fetch registered classes
        const registeredClasses = await fetchRegisteredClasses(userId);
        const courseMap = new Map<string, Course>();

        const historyItems = await Promise.all(
          registeredClasses.map(async (classInfo) => {
            let course: Course;
            
            if (courseMap.has(classInfo.field_course_code)) {
              course = courseMap.get(classInfo.field_course_code)!;
            } else {
              course = await fetchCourseByCode(classInfo.field_course_code);
              courseMap.set(classInfo.field_course_code, course);
            }

            const registerDate = formatTimestamp(classInfo.changed);
            const formattedFee = formatCurrency(course.field_course_tuition_fee);

            return {
              courseId: classInfo.field_course_code,
              courseName: course.title,
              registerDate: registerDate,
              fee: formattedFee,
              status: 'Đã xác nhận',
              classCode: classInfo.field_class_code,
              academicYear: classInfo.field_academic_year
            };
          })
        );

        setCourseHistory(historyItems);
        setFilteredHistory(historyItems);
      } catch (err: any) {
        if (err.response?.status === 403) {
          navigate('/login');
        } else {
          setError('Không thể tải lịch sử khóa học. Vui lòng thử lại sau.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  useEffect(() => {
    if (selectedYear === 'all') {
      setFilteredHistory(courseHistory);
    } else {
      const filtered = courseHistory.filter(item => item.academicYear === selectedYear);
      setFilteredHistory(filtered);
    }
  }, [selectedYear, courseHistory]);

  if (loading) return <div className="profile-card">Đang tải...</div>;
  if (error) return <div className="profile-card error-message">{error}</div>;

  return (
    <div className="profile-card">
      <div className="history-header">
        <h2 className="history-title">Lịch sử đăng ký khóa học</h2>
        <div className="semester-select">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="all">Tất cả năm học</option>
            {semesters.map((semester) => (
              <option key={semester.tid} value={semester.name.split('(')[1].split(')')[0]}>
                {semester.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="empty-message">Chưa có khóa học nào được đăng ký</div>
      ) : (
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Mã khóa học</th>
                <th>Tên khóa học</th>
                <th>Mã lớp</th>
                <th>Ngày đăng ký</th>
                <th>Học phí</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((course, index) => (
                <tr key={index}>
                  <td>{course.courseId}</td>
                  <td>{course.courseName}</td>
                  <td>{course.classCode}</td>
                  <td>{course.registerDate}</td>
                  <td>{course.fee} đ</td>
                  <td>
                    <span className={`status-badge ${course.status === 'Đã xác nhận' ? 'confirmed' : 'pending'}`}>
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseHistory;