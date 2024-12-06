import React, { useEffect, useState } from 'react'
import '../../../styles/pages/studentInfo/tuitionFees/TuitionFees.css'
import { useNavigate } from 'react-router-dom'
import { getUnpaidTuitions, TuitionFee } from '../../../services/apis/tuitionAPI'

const TuitionFees = () => {
  const navigate = useNavigate()
  const [tuitions, setTuitions] = useState<TuitionFee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        const data = await getUnpaidTuitions()
        setTuitions(data)
      } catch (err) {
        setError('Không thể tải thông tin học phí')
      } finally {
        setLoading(false)
      }
    }

    fetchTuitions()
  }, [])

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(price))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  if (loading) return <div>Đang tải...</div>
  if (error) return <div className="error-message">{error}</div>

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
            </tr>
          </thead>
          <tbody>
            {/* {tuitionData.map((fee, index) => (
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
            ))} */}
            {tuitions.map((tuition) => (
              <tr key={tuition.id}>
                <td>{tuition.class.Course.courseCode}</td>
                <td>{tuition.class.Course.name}</td>
                <td>{formatPrice(tuition.amount)}</td>
                <td>{formatDate(tuition.dueDate)}</td>
                <td>
                  <span className={`status-badge ${tuition.paymentDate ? 'paid' : 'unpaid'}`}>
                    {tuition.paymentDate ? formatDate(tuition.paymentDate) : 'Chưa thanh toán'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button className="pay-button" onClick={handlePayment}>THANH TOÁN</button>
      </div>
    </div>
  )
}

export default TuitionFees