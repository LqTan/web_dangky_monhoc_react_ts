import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Exam, ExamRegistration, fetchExams, fetchUserExamRegistrations } from '../../../services/apis/examAPI';
import { processExamPayment } from '../../../services/apis/examPaymentAPI';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/pages/studentInfo/examSchedule/ExamSchedule.css';

interface ExamWithRegistration extends Exam {
  registrationStatus?: string;
  registrationId?: string;
}

const ExamSchedule = () => {
  const [examSchedules, setExamSchedules] = useState<ExamWithRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const loadExams = async () => {
    try {
      if (!user?.id) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Tải song song cả danh sách kỳ thi và đăng ký của user
      const [allExams, userRegistrations] = await Promise.all([
        fetchExams(),
        fetchUserExamRegistrations(user.id)
      ]);

      // Chỉ lấy những kỳ thi mà user đã đăng ký
      const registeredExams = allExams.filter(exam => 
        userRegistrations.some(reg => reg.title.includes(exam.title))
      ).map(exam => {
        const registration = userRegistrations.find(reg => 
          reg.title.includes(exam.title)
        );
        
        return {
          ...exam,
          registrationStatus: registration?.field_registration_exam_status,
          registrationId: registration?.nid
        };
      });

      setExamSchedules(registeredExams);
    } catch (err: any) {
      if (err.response?.status === 403) {
        navigate('/login');
      } else {
        setError('Không thể tải lịch thi. Vui lòng thử lại sau.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, [user, navigate]);

  useEffect(() => {
    // Kiểm tra và hiển thị thông báo từ state khi redirect về
    if (location.state) {
      const { success, message: paymentMessage } = location.state as { 
        success: boolean;
        message: string;
      };
      
      if (success) {
        message.success(paymentMessage);
        // Reload lại danh sách kỳ thi sau khi thanh toán thành công
        loadExams();
      } else {
        message.error(paymentMessage);
      }

      // Xóa state sau khi đã hiển thị thông báo
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const formatTime = (seconds: string): string => {
    const hours = Math.floor(parseInt(seconds) / 3600);
    const minutes = Math.floor((parseInt(seconds) % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
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

  const handlePayment = async (registrationId: string) => {
    try {
      const response = await processExamPayment([parseInt(registrationId)]);
      if (response.payment_url) {
        window.location.href = response.payment_url;
      }
    } catch (error) {
      console.error('Lỗi xử lý thanh toán:', error);
      message.error('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.');
    }
  };

  if (loading) return <div className="loading-container">Đang tải...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="exam-schedule-container">
      <h2 className="page-title">
        <i className="bi bi-calendar2-check"></i>
        Lịch thi của tôi
      </h2>

      <div className="exam-grid">
        {examSchedules.map((exam) => (
          <div key={exam.nid} className={`exam-card ${exam.registrationStatus ? 'registered' : ''}`}>
            <div className="exam-card-header">
              <i className="bi bi-file-earmark-text"></i>
              <h3>{exam.title}</h3>
            </div>

            <div className="exam-info">
              <div className="info-item">
                <i className="bi bi-calendar-date"></i>
                <span>Ngày thi: {formatDate(exam.field_exam_date)}</span>
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
                  Lệ phí: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                    .format(parseFloat(exam.field_exam_fee))}
                </span>
              </div>

              <div className="exam-status-row">
                <div className="exam-status">
                  {getStatusBadge(exam.field_exam_status)}
                </div>
                
                {exam.registrationStatus === 'pending' && (
                  <button 
                    className="payment-button"
                    onClick={() => handlePayment(exam.registrationId!)}
                  >
                    <i className="bi bi-credit-card"></i>
                    Thanh toán
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {examSchedules.length === 0 && (
          <div className="no-exams-message">
            <i className="bi bi-calendar-x"></i>
            <p>Bạn chưa đăng ký kỳ thi nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSchedule;