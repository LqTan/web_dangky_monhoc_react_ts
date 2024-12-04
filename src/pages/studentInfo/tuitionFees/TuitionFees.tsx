import React from 'react'
import '../../../styles/pages/studentInfo/tuitionFees/TuitionFees.css'
import { useNavigate } from 'react-router-dom'

const TuitionFees = () => {
  const navigate = useNavigate()
  const handlePayment = () => {
    navigate('/payment-confirmation')
  }

  const tuitionData = [
    {
      courseId: 'CS101',
      courseName: 'Tin học văn phòng',
      amount: '2.500.000 đ',
      dueDate: '15/3/2024',
      status: 'Chưa thanh toán'
    },
    {
      courseId: 'ENG201',
      courseName: 'Tiếng Anh B1',
      amount: '3.000.000 đ',
      dueDate: '20/3/2024',
      status: 'Đã thanh toán'
    }
  ]

  return (
    <div className="profile-card">
      <h2 className="tuition-title">Học phí</h2>
      <div className="tuition-table">
        <table>
          <thead>
            <tr>
              <th>Mã môn</th>
              <th>Tên môn học</th>
              <th>Số tiền</th>
              <th>Hạn nộp</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tuitionData.map((fee, index) => (
              <tr key={index}>
                <td>{fee.courseId}</td>
                <td>{fee.courseName}</td>
                <td>{fee.amount}</td>
                <td>{fee.dueDate}</td>
                <td>
                  <span className={`status-badge ${fee.status === 'Đã thanh toán' ? 'paid' : 'unpaid'}`}>
                    {fee.status}
                  </span>
                </td>
                <td>
                  {fee.status === 'Chưa thanh toán' && (
                    <button className="pay-button" onClick={handlePayment}>THANH TOÁN</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TuitionFees