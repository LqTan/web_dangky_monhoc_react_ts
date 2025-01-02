import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../../styles/pages/paymentConfirmation/PaymentConfirmation.css'
import SuccessModal from '../../modal/SuccessModal'
import { processPayment, registerWithPayPal, registerWithVNPay } from '../../services/apis/classRegistrationAPI'

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PaymentConfirmationProps {
  registrations: {
    classInfo: {
      title: string;
      field_class_start_time: string;
      field_class_end_time: string;
      field_class_open_date: string;
      field_class_end_date: string;
      field_class_weekdays: string[];
      field_room: string;
      field_teacher_fullname: string;
    };
    courseInfo: {
      title: string;
      field_course_code: string;
      field_course_tuition_fee: string;
    };
  }[];
}

const PaymentConfirmation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { registrations } = location.state as PaymentConfirmationProps || { registrations: [] }
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Kiểm tra nếu không có thông tin đăng ký
  // useEffect(() => {
  //   if (!registrations || registrations.length === 0) {
  //     navigate('/')
  //   }
  // }, [registrations, navigate])
  useEffect(() => {
    if (selectedPayment === 'paypal' && window.paypal) {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          const totalAmount = calculateTotalAmount();
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (totalAmount / 23000).toFixed(2) // Đổi tiền Việt VND sang Đô la USD
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const order = await actions.order.capture();
            const classCodes = registrations.map(reg => reg.classInfo.title);
            
            // Gọi API thanh toán với transaction ID từ PayPal
            await processPayment(classCodes, 'paypal', order.id);
            
            setShowSuccessModal(true);
          } catch (error) {
            console.error('Lỗi xử lý PayPal:', error);
            alert('Có lỗi xảy ra khi xử lý thanh toán PayPal');
          }
        }
      }).render('#paypal-button-container');
    }
  }, [selectedPayment]);

  const calculateTotalAmount = () => {
    return registrations.reduce((total, reg) => {
      return total + parseInt(reg.courseInfo.field_course_tuition_fee)
    }, 0)
  }

  const handleVNPayPayment = async () => {
    try {
      setIsProcessing(true);
      const classCodes = registrations.map(reg => reg.classInfo.title);
      
      // Thêm returnUrl vào request
      const frontendUrl = window.location.origin; // Lấy domain của frontend
      const returnUrl = `${frontendUrl}/payment/vnpay-return`;
      
      const response = await processPayment(
        classCodes, 
        'vnpay',
        undefined, // paypalTransactionId
        returnUrl // Thêm returnUrl
      );
      
      if (response.payment_url) {
        window.location.href = response.payment_url;
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      alert('Có lỗi xảy ra khi xử lý thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate(-1)
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    navigate('/')
  }

  return (
    <div className="payment-confirmation">
      <div className="payment-card">
        <h2>Xác nhận thanh toán</h2>

        <div className="registration-list">
          <h3>Danh sách lớp học đăng ký</h3>
          {registrations.map((reg, index) => (
            <div key={index} className="registration-item">
              <div className="course-info">
                <h4>{reg.courseInfo.title}</h4>
                <p>Mã lớp: {reg.classInfo.title}</p>
                <p>Giảng viên: {reg.classInfo.field_teacher_fullname}</p>
                <p>Phòng học: {reg.classInfo.field_room}</p>
                <p>Học phí: {new Intl.NumberFormat('vi-VN').format(parseInt(reg.courseInfo.field_course_tuition_fee))} đ</p>
              </div>
            </div>
          ))}
        </div>

        <div className="total-amount">
          <h3>Tổng thanh toán</h3>
          <p>{new Intl.NumberFormat('vi-VN').format(calculateTotalAmount())} đ</p>
        </div>

        <div className="payment-methods">
          <h3>Phương thức thanh toán</h3>
          <div className="payment-options">
            <div 
              className={`payment-method ${selectedPayment === 'paypal' ? 'active' : ''}`}
              onClick={() => setSelectedPayment('paypal')}
            >
              <i className="bi bi-paypal"></i>
              <span>PayPal</span>
            </div>
            <div 
              className={`payment-method ${selectedPayment === 'bank' ? 'active' : ''}`}
              onClick={() => setSelectedPayment('bank')}
            >
              <i className="bi bi-bank"></i>
              <span>Ngân hàng (VNPAY)</span>
            </div>
          </div>
        </div>

        <div className="payment-actions">
          <button className="cancel-button" onClick={handleCancel}>
            Hủy
          </button>
          {selectedPayment === 'paypal' ? (
            <div id="paypal-button-container"></div>
          ) : selectedPayment === 'bank' ? (
            <button 
              className="confirm-button" 
              onClick={handleVNPayPayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Đang xử lý...' : 'Thanh toán qua VNPAY'}
            </button>
          ) : null}
        </div>
      </div>
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default PaymentConfirmation