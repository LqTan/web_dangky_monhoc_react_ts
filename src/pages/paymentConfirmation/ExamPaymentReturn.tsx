import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Spin } from 'antd';
import '../../styles/pages/paymentConfirmation/ExamPaymentReturn.css';

const ExamPaymentReturn = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = () => {
      try {
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        const code = params.get('code');
        const message = params.get('message');

        // Đợi 2 giây trước khi redirect để user có thể đọc thông báo
        setTimeout(() => {
          if (status === 'success' && code === '00') {
            navigate('/student-info', {
              replace: true,
              state: { 
                success: true,
                message: 'Thanh toán thành công!'
              }
            });
          } else {
            navigate('/student-info', {
              replace: true,
              state: {
                success: false,
                message: message || 'Thanh toán không thành công. Vui lòng thử lại.'
              }
            });
          }
        }, 2000);
      } catch (error) {
        console.error('Lỗi xử lý kết quả thanh toán:', error);
        setTimeout(() => {
          navigate('/student-info', {
            replace: true,
            state: {
              success: false,
              message: 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.'
            }
          });
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="payment-return-container">
      <div className="payment-return-content">
        {isProcessing ? (
          <Spin size="large" />
        ) : (
          <Alert
            message={
              location.search.includes('status=success') 
                ? "Xử lý thanh toán thành công" 
                : "Xử lý thanh toán thất bại"
            }
            description={new URLSearchParams(location.search).get('message') || 'Đang chuyển hướng...'}
            type={location.search.includes('status=success') ? "success" : "error"}
            showIcon
          />
        )}
      </div>
    </div>
  );
};

export default ExamPaymentReturn;