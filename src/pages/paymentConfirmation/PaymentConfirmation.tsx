import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../../styles/pages/paymentConfirmation/PaymentConfirmation.css'
import SuccessModal from '../../modal/SuccessModal'
import { AnalyticsData, registerWithPayPal, registerWithVNPay } from '../../services/apis/classRegistrationAPI'

// Khai báo kiểu cho PayPal global
declare global {
  interface Window {
    paypal?: any;
    gtag?: (command: string, action: string, params: any) => void;
  }
}

interface ClassInfo {
  title: string
  field_class_start_time: string
  field_class_end_time: string
  field_class_open_date: string
  field_class_end_date: string
  field_class_weekdays: string[]
  field_current_num_of_participant: number
  field_max_num_of_participant: string
  field_room: string
  field_teacher_fullname: string
}

interface CourseInfo {
  title: string
  field_course_code: string
  field_course_tuition_fee: string
}

const PaymentConfirmation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { classInfo, courseInfo } = location.state || {}
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Kiểm tra nếu không có thông tin khóa học, chuyển về trang chủ
  if (!classInfo || !courseInfo) {
    navigate('/')
    return null
  }

  // Thêm hàm track event
  const trackPurchaseEvent = (analyticsData: AnalyticsData, transactionId?: string) => {
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: analyticsData.amount,
        currency: analyticsData.currency,
        items: [{
          item_id: analyticsData.class_code,
          item_name: analyticsData.class_name,
          price: analyticsData.amount
        }]
      });
    }
  };

  const trackBeginCheckout = (analyticsData: AnalyticsData) => {
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: analyticsData.currency,
        value: analyticsData.amount,
        items: [{
          item_id: analyticsData.class_code,
          item_name: analyticsData.class_name,
          price: analyticsData.amount
        }]
      });
    }
  };

  useEffect(() => {
    if (selectedPayment === 'paypal' && window.paypal) {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: `Đăng ký khóa học ${courseInfo.title}`,
              amount: {
                currency_code: 'USD',
                value: (parseFloat(courseInfo.field_course_tuition_fee) / 23000).toFixed(2)
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            setIsProcessing(true);
            const order = await actions.order.capture();
            
            const response = await registerWithPayPal(classInfo.title, order.id);
            if (response.analytics_data) {
              trackPurchaseEvent(response.analytics_data, order.id);
            }
            if (response.message) {
              setShowSuccessModal(true);
            }
          } catch (error) {
            console.error('Lỗi thanh toán:', error);
            alert('Có lỗi xảy ra trong quá trình thanh toán');
          } finally {
            setIsProcessing(false);
          }
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          alert('Có lỗi xảy ra trong quá trình thanh toán');
          setIsProcessing(false);
        }
      }).render('#paypal-button-container');
    }
  }, [selectedPayment]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(price))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatSchedule = (weekdays: string[]) => {
    return weekdays.map(day => `Thứ ${day === '8' ? 'CN' : day}`).join(', ')
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    navigate('/student-info')
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const handleBankPayment = () => {
    // Xử lý thanh toán qua ngân hàng
    alert('Tính năng đang được phát triển')
  }

  // Thêm xử lý thanh toán qua VNPAY.
  const handleVNPayPayment = async () => {
    try {
      setIsProcessing(true);
      const response = await registerWithVNPay(classInfo.title);

      if (response.analytics_data) {
        trackBeginCheckout(response.analytics_data);
      }
      
      if (response.payment_url) {
        window.location.href = response.payment_url;
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      alert('Có lỗi xảy ra trong quá trình thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionData = params.get('transaction_data');
    
    if (transactionData) {
      try {
        const analyticsData = JSON.parse(transactionData);
        if (params.get('vnp_ResponseCode') === '00') {
          trackPurchaseEvent(analyticsData, analyticsData.transaction_id);
        }
      } catch (error) {
        console.error('Lỗi xử lý dữ liệu transaction:', error);
      }
    }
  }, []);

  return (
    <div className="payment-container">
      <div className="payment-content">
        <h2>Xác nhận thanh toán</h2>
        
        <div className="course-list-section">
          <h3>Thông tin thanh toán</h3>
          <div className="course-payment-item">
            <div className="course-info">
              <div className="info-row">
                <div className="info-group">
                  <span className="label">Mã môn:</span>
                  <span className="value">{courseInfo.field_course_code}</span>
                </div>
                <div className="info-group">
                  <span className="label">Tên môn học:</span>
                  <span className="value">{courseInfo.title}</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-group">
                  <span className="label">Mã lớp:</span>
                  <span className="value">{classInfo.title}</span>
                </div>
                <div className="info-group">
                  <span className="label">Giảng viên:</span>
                  <span className="value">{classInfo.field_teacher_fullname}</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-group">
                  <span className="label">Lịch học:</span>
                  <span className="value">{formatSchedule(classInfo.field_class_weekdays)}</span>
                </div>
                <div className="info-group">
                  <span className="label">Thời gian:</span>
                  <span className="value">{`${classInfo.field_class_start_time} - ${classInfo.field_class_end_time}`}</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-group">
                  <span className="label">Phòng:</span>
                  <span className="value">{classInfo.field_room}</span>
                </div>
                <div className="info-group">
                  <span className="label">Thời gian:</span>
                  <span className="value">
                    {formatDate(classInfo.field_class_open_date)} - {formatDate(classInfo.field_class_end_date)}
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-group">
                  <span className="label">Học phí:</span>
                  <span className="value price">{formatPrice(courseInfo.field_course_tuition_fee)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="total-amount">
          <span>Tổng tiền thanh toán:</span>
          <span className="amount">{formatPrice(courseInfo.field_course_tuition_fee)}</span>
        </div>

        <div className="payment-method-section">
          <h3>Chọn phương thức thanh toán</h3>
          <div className="payment-methods">
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