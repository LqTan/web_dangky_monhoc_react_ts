import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRegisteredClasses, ClassRegistration } from '../../../services/apis/classRegistrationAPI';
import { fetchClasses, Class } from '../../../services/apis/classAPI';
import { fetchCourseByCode, Course } from '../../../services/apis/courseAPI';
import '../../../styles/pages/studentInfo/courseHistory/CourseHistory.css';

interface CourseHistoryItem {
  registrationTitle: string;
  courseId: string;
  courseName: string;
  classCode: string;
  status: string;
  fee: string;
  classInfo: Class;
  courseInfo: Course;
}

const CourseHistory = () => {
  const [courseHistory, setCourseHistory] = useState<CourseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        if (!userId) {
          throw new Error('Không tìm thấy thông tin người dùng');
        }

        // Lấy danh sách đăng ký
        const registrations = await fetchRegisteredClasses(userId);
        
        // Lấy danh sách lớp học
        const classes = await fetchClasses();
        
        // Xử lý và map dữ liệu
        const historyItems = await Promise.all(
          registrations.map(async (reg) => {
            // Lấy mã lớp từ title đăng ký
            const classCode = reg.title.split(' - ')[1];
            
            // Tìm thông tin lớp học
            const classInfo = classes.find(c => c.title === classCode);
            
            if (!classInfo) {
              throw new Error(`Không tìm thấy thông tin lớp ${classCode}`);
            }

            // Lấy thông tin khóa học
            const course = await fetchCourseByCode(classInfo.field_course_code);

            return {
              registrationTitle: reg.title,
              courseId: classInfo.field_course_code,
              courseName: course.title,
              classCode: classInfo.title,
              status: reg.field_registration_status,
              fee: course.field_course_tuition_fee,
              classInfo: classInfo,
              courseInfo: course
            };
          })
        );

        setCourseHistory(historyItems);
      } catch (err: any) {
        console.error(err);
        setError('Không thể tải lịch sử đăng ký. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handlePayment = (items: CourseHistoryItem[]) => {
    const unpaidItems = items.filter(item => item.status === 'pending');
    if (unpaidItems.length === 0) {
      alert('Không có lớp học nào cần thanh toán');
      return;
    }

    navigate('/payment-confirmation', {
      state: {
        registrations: unpaidItems.map(item => ({
          classInfo: item.classInfo,
          courseInfo: item.courseInfo
        }))
      }
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'confirmed':
        return 'confirmed';
      case 'cancelled':
        return 'cancelled';
      default:
        return '';
    }
  };

  if (loading) return <div className="profile-card">Đang tải...</div>;
  if (error) return <div className="profile-card error-message">{error}</div>;

  // Lọc ra các đăng ký cần thanh toán
  const pendingRegistrations = courseHistory.filter(item => item.status === 'pending');

  return (
    <div className="profile-card">
      <div className="history-header">
        <h2 className="history-title">Lịch sử đăng ký khóa học</h2>
        {pendingRegistrations.length > 0 && (
          <button 
            className="payment-button"
            onClick={() => handlePayment(courseHistory)}
          >
            Thanh toán ({pendingRegistrations.length} lớp)
          </button>
        )}
      </div>

      {courseHistory.length === 0 ? (
        <div className="empty-message">Chưa có khóa học nào được đăng ký</div>
      ) : (
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Mã khóa học</th>
                <th>Tên khóa học</th>
                <th>Mã lớp</th>
                <th>Học phí</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {courseHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.courseId}</td>
                  <td>{item.courseName}</td>
                  <td>{item.classCode}</td>
                  <td>{new Intl.NumberFormat('vi-VN').format(parseInt(item.fee))} đ</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {getStatusText(item.status)}
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