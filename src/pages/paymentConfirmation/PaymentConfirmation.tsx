import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/pages/paymentConfirmation/PaymentConfirmation.css'
import { getUnpaidTuitions, TuitionFee } from '../../services/apis/tuitionAPI'
import PayPalButton from '../../components/paypalbutton/PayPalButton'
import axios from 'axios'
import SuccessModal from '../../modal/SuccessModal'

interface SelectedTuition extends TuitionFee {
  selected: boolean
}

const PaymentConfirmation = () => {
  const navigate = useNavigate()
  const [tuitions, setTuitions] = useState<SelectedTuition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        const data = await getUnpaidTuitions()
        const tuitionsWithSelection = data.map(tuition => ({
          ...tuition,
          selected: false
        }))
        setTuitions(tuitionsWithSelection)
      } catch (err) {
        setError('Không thể tải thông tin học phí')
      } finally {
        setLoading(false)
      }
    }

    fetchTuitions()
  }, [])

  const handleCourseSelection = (id: string) => {
    setTuitions(currentTuitions =>
      currentTuitions.map(tuition =>
        tuition.id === id ? { ...tuition, selected: !tuition.selected } : tuition
      )
    )
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(price))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const calculateTotal = () => {
    return tuitions
      .filter(tuition => tuition.selected)
      .reduce((total, tuition) => total + parseFloat(tuition.amount), 0)
  }

  const handlePayPalSuccess = async (details: any) => {
    try {
      const selectedTuitions = tuitions.filter(tuition => tuition.selected)
      
      // Gọi API để cập nhật trạng thái học phí
      const response = await axios.post('http://localhost:3000/api/tuitions/mark-as-paid', {
        tuitionIds: selectedTuitions.map(tuition => tuition.id)
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })

      if (response.data) {
        setShowSuccessModal(true)
      } else {
        throw new Error('Cập nhật trạng thái học phí thất bại')
      }
    } catch (error) {
      console.error('Error updating tuition status:', error)
      alert('Có lỗi xảy ra khi cập nhật trạng thái học phí')
    }
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    navigate('/student-info')
  }

  const handleCancel = () => {
    navigate('/tuition-fees')
  }

  if (loading) return <div>Đang tải...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="payment-container">
      <div className="payment-content">
        <h2>Xác nhận thanh toán</h2>
        
        <div className="course-list-section">
          <h3>Danh sách môn học cần thanh toán</h3>
          {tuitions.map(tuition => (
            <div key={tuition.id} className="course-payment-item">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={tuition.selected}
                  onChange={() => handleCourseSelection(tuition.id)}
                />
                <div className="course-info">
                  <div className="course-code-name">
                    <span className="course-code">Mã môn: {tuition.class.Course.courseCode}</span>
                    <span className="course-name">Tên môn học: {tuition.class.Course.name}</span>
                  </div>
                  <div className="course-price-date">
                    <span className="course-price">Số tiền: {formatPrice(tuition.amount)}</span>
                    <span className="due-date">Hạn nộp: {formatDate(tuition.dueDate)}</span>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="total-amount">
          <span>Tổng tiền thanh toán:</span>
          <span className="amount">{formatPrice(calculateTotal().toString())}</span>
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
              <span>Ngân hàng</span>
            </div>
          </div>
        </div>

        <div className="payment-actions">
          <button className="cancel-button" onClick={handleCancel}>
            Hủy
          </button>
          {selectedPayment === 'paypal' && (
            <div className="paypal-button-container">
              <PayPalButton 
                amount={calculateTotal()} 
                onSuccess={handlePayPalSuccess}
              />
            </div>
          )}
          {selectedPayment === 'bank' && (
            <button 
              className="confirm-button"
              onClick={() => alert('Tính năng đang được phát triển')}
              disabled={!tuitions.some(t => t.selected)}
            >
              Thanh toán qua Ngân hàng
            </button>
          )}
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