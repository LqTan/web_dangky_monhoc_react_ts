import React, { useEffect, useState } from 'react';
import { Modal } from 'antd'; // Import Modal từ antd
import { Exam, fetchExams } from '../../../services/apis/examAPI';
import '../../../styles/pages/studentInfo/examSchedule/ExamScheduleList.css';
import ExamRegistrationForm from '../../examRegistrationForm/ExamRegistrationForm';

const ExamSchedulesList = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await fetchExams();
        setExams(data);
      } catch (err) {
        setError('Không thể tải danh sách kỳ thi. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  const handleRegisterClick = (exam: Exam) => {
    setSelectedExam(exam);
    setShowRegistrationForm(true);
  };

  const handleRegistrationSuccess = () => {
    setShowRegistrationForm(false);
    // Có thể refresh danh sách kỳ thi ở đây nếu cần
  };

  const formatTime = (seconds: string) => {
    const hours = Math.floor(parseInt(seconds) / 3600);
    const minutes = Math.floor((parseInt(seconds) % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sap_dien_ra':
        return <span className="status-badge upcoming">Sắp diễn ra</span>;
      case 'dang_dien_ra':
        return <span className="status-badge ongoing">Đang diễn ra</span>;
      case 'da_ket_thuc':
        return <span className="status-badge completed">Đã kết thúc</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="exam-schedules">
      <div className="exam-header">
        <h1>
          <i className="bi bi-calendar2-check"></i>
          Lịch thi
        </h1>
      </div>

      <div className="exam-grid">
        {exams.map((exam) => (
          <div key={exam.nid} className="exam-card">
            <div className="exam-card-header">
              <i className="bi bi-file-earmark-text"></i>
              <h3>{exam.title}</h3>
            </div>
            
            <div className="exam-info">
              <div className="info-item">
                <i className="bi bi-calendar-date"></i>
                <span>Ngày thi: {new Date(exam.field_exam_date).toLocaleDateString('vi-VN')}</span>
              </div>
              
              <div className="info-item">
                <i className="bi bi-clock"></i>
                <span>
                  Thời gian: {formatTime(exam.field_exam_start_time)} - {formatTime(exam.field_exam_end_time)}
                </span>
              </div>
              
              <div className="info-item">
                <i className="bi bi-geo-alt"></i>
                <span>Phòng thi: {exam.field_exam_location}</span>
              </div>
              
              <div className="info-item">
                <i className="bi bi-currency-dollar"></i>
                <span>
                  Lệ phí: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(exam.field_exam_fee))}
                </span>
              </div>
              
              <div className="exam-status">
                {getStatusBadge(exam.field_exam_status)}
              </div>

              <div className="exam-actions">
                <button 
                    className="register-button"
                    onClick={() => handleRegisterClick(exam)}
                >
                    <i className="bi bi-pencil-square"></i>
                    Đăng ký thi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showRegistrationForm}
        onCancel={() => setShowRegistrationForm(false)}
        footer={null}
        width={700}
      >
        {selectedExam && (
          <ExamRegistrationForm
            exam={selectedExam}
            onClose={() => setShowRegistrationForm(false)}
            onSuccess={handleRegistrationSuccess}
          />
        )}
      </Modal>
    </div>
  );
};

export default ExamSchedulesList;