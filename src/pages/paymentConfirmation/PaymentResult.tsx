import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../../styles/pages/paymentConfirmation/PaymentResult.css'

const PaymentResult = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const vnp_ResponseCode = params.get('vnp_ResponseCode')
    
    // VNPay trả về 00 là thành công
    if (vnp_ResponseCode === '00') {
      setStatus('success')
      setMessage('Thanh toán thành công!')
    } else {
      setStatus('error')
      setMessage('Thanh toán thất bại!')
    }
  }, [location])

  const handleReturn = () => {
    navigate('/tuition-fees')
  }

  return (
    <div className="payment-result-container">
      <div className="payment-result-card">
        <div className={`payment-status ${status}`}>
          {status === 'loading' ? (
            <div className="loading">Đang xử lý kết quả thanh toán...</div>
          ) : (
            <>
              <h2>{message}</h2>
              <button className="return-button" onClick={handleReturn}>
                Quay lại trang học phí
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentResult