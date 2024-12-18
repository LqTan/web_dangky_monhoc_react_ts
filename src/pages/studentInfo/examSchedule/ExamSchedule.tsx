import React, { useEffect, useState } from 'react';
import { fetchExams, ExamInfo } from '../../../services/apis/examAPI';
import { fetchRegisteredClasses } from '../../../services/apis/classRegistrationAPI';
import '../../../styles/pages/studentInfo/examSchedule/ExamSchedule.css';
import { useNavigate } from 'react-router-dom';

const ExamSchedule = () => {
  const [examSchedules, setExamSchedules] = useState<ExamInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formatTime = (seconds: string): string => {
    const hours = Math.floor(parseInt(seconds) / 3600);
    const minutes = Math.floor((parseInt(seconds) % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const loadExams = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        if (!userId) {
          throw new Error('Không tìm thấy thông tin người dùng');
        }

        // Lấy danh sách lớp học đã đăng ký của user
        const registeredClasses = await fetchRegisteredClasses(userId);
        const registeredClassCodes = registeredClasses.map(cls => cls.field_class_code);

        // Lấy tất cả kỳ thi và lọc theo lớp học đã đăng ký
        const allExams = await fetchExams();
        const userExams = allExams.filter(exam => 
          registeredClassCodes.includes(exam.field_class_code)
        );

        setExamSchedules(userExams);
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 403) {
          navigate('/login');
        } else {
          setError('Không thể tải lịch thi. Vui lòng thử lại sau.');
        }
        console.error(err);
        setLoading(false);
      }
    };

    loadExams();
  }, [navigate]);

  if (loading) return <div className="profile-card">Đang tải...</div>;
  if (error) return <div className="profile-card error-message">{error}</div>;

  return (
    <div className="profile-card">
      <h2 className="exam-title">Lịch thi</h2>
      <div className="exam-table">
        <table>
          <thead>
            <tr>
              <th>Mã môn</th>
              <th>Tên môn thi</th>
              <th>Ngày thi</th>
              <th>Giờ thi</th>
              <th>Phòng thi</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {examSchedules.map((exam, index) => {
              const examDate = new Date(exam.field_date_exam);
              const today = new Date();
              const status = examDate > today ? 'Sắp thi' : 'Đã thi';

              return (
                <tr key={index}>
                  <td>{exam.field_course_code}</td>
                  <td>{exam.title}</td>
                  <td>{formatDate(exam.field_date_exam)}</td>
                  <td>{`${formatTime(exam.field_start_exam)} - ${formatTime(exam.field_end_exam)}`}</td>
                  <td>{exam.field_exam_location}</td>
                  <td>
                    <span className={`status-badge ${status === 'Sắp thi' ? 'upcoming' : 'completed'}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamSchedule;