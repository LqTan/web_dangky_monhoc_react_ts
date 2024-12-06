import React, { useEffect, useState } from 'react'
import '../../styles/pages/paymentConfirmation/PaymentConfirmation.css'

import { getUnpaidTuitions, TuitionFee } from '../../services/apis/tuitionAPI'
import { useNavigate } from 'react-router-dom'
import { createVNPayPayment } from '../../services/apis/paymentAPI'

interface SelectedTuition extends TuitionFee {
  selected: boolean
}

const PaymentConfirmation = () => {
  const navigate = useNavigate()
  const [tuitions, setTuitions] = useState<SelectedTuition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank')

  const handlePayment = async () => {
    try {
      const selectedTuitions = tuitions.filter(tuition => tuition.selected)
      
      if (selectedTuitions.length === 0) {
        alert('Vui lòng chọn ít nhất một học phí để thanh toán')
        return
      }

      if (paymentMethod !== 'bank') {
        alert('Hiện tại chỉ hỗ trợ thanh toán qua VNPay')
        return
      }

      const totalAmount = calculateTotal()
      const tuitionIds = selectedTuitions.map(tuition => tuition.id)

      const response = await createVNPayPayment({
        amount: totalAmount,
        tuitionIds: tuitionIds
      })

      // Chuyển hướng đến trang thanh toán VNPay
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl
      } else {
        throw new Error('Không nhận được URL thanh toán')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Có lỗi xảy ra khi xử lý thanh toán')
    }
  }

  const handleCancel = () => {
    navigate('/tuition-fees')
  }

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
                    <div className="course-code">Mã môn: {tuition.class.Course.courseCode}</div>
                    <div className="course-name">Tên môn học: {tuition.class.Course.name}</div>
                  </div>
                  <div className="course-price-date">
                    <div className="course-price">Số tiền: {formatPrice(tuition.amount)}</div>
                    <div className="due-date">Hạn nộp: {formatDate(tuition.dueDate)}</div>
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
          <h3>Phương thức thanh toán</h3>
          <div className="payment-methods">
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <i className="bi bi-bank"></i>
              Chuyển khoản ngân hàng
            </label>

            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="credit"
                checked={paymentMethod === 'credit'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <i className="bi bi-credit-card"></i>
              Thẻ tín dụng/ghi nợ
            </label>

            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="ewallet"
                checked={paymentMethod === 'ewallet'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <i className="bi bi-wallet2"></i>
              Ví điện tử
            </label>
          </div>
        </div>

        <div className="payment-actions">
          <button className="cancel-button" onClick={handleCancel}>
            Hủy
          </button>
          <button 
            className="confirm-button" 
            onClick={handlePayment}
            disabled={!tuitions.some(t => t.selected)}
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentConfirmation