import React, { useState } from 'react'
import '../../styles/pages/paymentConfirmation/PaymentConfirmation.css'

const PaymentConfirmation = () => {
  const [selectedCourses, setSelectedCourses] = useState([
    {
      id: 1,
      code: 'CS101',
      name: 'Tin học văn phòng',
      price: '2.500.000 đ',
      dueDate: '2024-03-15',
      selected: false
    },
    {
      id: 2,
      code: 'ENG201',
      name: 'Tiếng Anh B1',
      price: '3.000.000 đ',
      dueDate: '2024-03-20',
      selected: false
    }
  ])

  const [paymentMethod, setPaymentMethod] = useState('bank')

  const handleCourseSelection = (id: number) => {
    setSelectedCourses(courses =>
      courses.map(course =>
        course.id === id ? { ...course, selected: !course.selected } : course
      )
    )
  }

  const calculateTotal = () => {
    return selectedCourses
      .filter(course => course.selected)
      .reduce((total, course) => {
        const price = parseInt(course.price.replace(/\D/g, ''))
        return total + price
      }, 0)
  }

  return (
    <div className="payment-container">
      <div className="payment-content">
        <h2>Xác nhận thanh toán</h2>
        
        <div className="course-list-section">
          <h3>Danh sách môn học cần thanh toán</h3>
          {selectedCourses.map(course => (
            <div key={course.id} className="course-payment-item">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={course.selected}
                  onChange={() => handleCourseSelection(course.id)}
                />
                <div className="course-info">
                  <div className="course-code-name">
                    <div className="course-code">Mã môn: {course.code}</div>
                    <div className="course-name">Tên môn học: {course.name}</div>
                  </div>
                  <div className="course-price-date">
                    <div className="course-price">Số tiền: {course.price}</div>
                    <div className="due-date">Hạn nộp: {course.dueDate}</div>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="total-amount">
          <span>Tổng tiền thanh toán:</span>
          <span className="amount">{calculateTotal().toLocaleString('vi-VN')} đ</span>
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
          <button className="cancel-button">Hủy</button>
          <button className="confirm-button">Xác nhận thanh toán</button>
        </div>
      </div>
    </div>
  )
}

export default PaymentConfirmation