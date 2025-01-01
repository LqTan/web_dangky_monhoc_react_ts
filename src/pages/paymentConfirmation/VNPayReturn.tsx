import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SuccessModal from '../../modal/SuccessModal';

const VNPayReturn = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = () => {
      try {
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        const code = params.get('code');

        if (status === 'success' && code === '00') {
          setShowSuccessModal(true);
        } else {
          // Nếu thanh toán thất bại, chuyển về trang chủ
          navigate('/', { 
            replace: true,
            state: { 
              error: params.get('message') || 'Thanh toán không thành công. Vui lòng thử lại.' 
            } 
          });
        }
      } catch (error) {
        console.error('Lỗi xử lý kết quả thanh toán:', error);
        navigate('/', { 
          replace: true,
          state: { 
            error: 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.' 
          } 
        });
      } finally {
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/', { replace: true });
  };

  if (isProcessing) {
    return <div>Đang xử lý kết quả thanh toán...</div>;
  }

  return (
    <SuccessModal 
      isOpen={showSuccessModal}
      onClose={handleModalClose}
    />
  );
};

export default VNPayReturn;