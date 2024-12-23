import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/pages/paymentConfirmation/PaymentResult.css';
import { useAuth } from '../../context/AuthContext';
import { verifyPaymentStatus } from '../../services/apis/classRegistrationAPI';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get('vnp_ResponseCode');
    const transactionStatus = params.get('vnp_TransactionStatus');
    const paypalOrderId = params.get('orderId');
    
    // Xử lý kết quả thanh toán
    if (responseCode === '00' && transactionStatus === '00') {
      // VNPAY success
      setStatus('success');
      setMessage('Thanh toán và đăng ký thành công!');
    } else if (paypalOrderId) {
      // PayPal success (đã được xử lý ở PaymentConfirmation.tsx)
      setStatus('success');
      setMessage('Thanh toán và đăng ký thành công!');
    } else {
      setStatus('error');
      setMessage('Thanh toán thất bại!');
    }
  }, [location]);

  const handleReturn = () => {
    if (isAuthenticated) {
      navigate('/student-info');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="payment-result-container">
      <div className="payment-result-card">
        <div className={`payment-status ${status}`}>
          {status === 'loading' ? (
            <div className="loading">Đang xử lý kết quả thanh toán...</div>
          ) : (
            <>
              <h2>{message}</h2>
              <p>{isAuthenticated ? `Xin chào ${user?.name}` : 'Vui lòng đăng nhập lại'}</p>
              <button className="return-button" onClick={handleReturn}>
                {isAuthenticated ? 'Quay lại trang thông tin sinh viên' : 'Đăng nhập'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;