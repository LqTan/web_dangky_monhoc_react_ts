import React from 'react'
import '../../../styles/pages/studentInfo/courseHistory/CourseHistory.css'

const CourseHistory = () => {
  const courseHistory = [
    {
      courseId: 'CS101',
      courseName: 'Tin học văn phòng',
      registerDate: '15/1/2024',
      fee: '2.500.000',
      status: 'Đã xác nhận'
    },
    {
      courseId: 'ENG201',
      courseName: 'Tiếng Anh B1',
      registerDate: '1/2/2024',
      fee: '4.500.000',
      status: 'Chờ xác nhận'
    }
  ]

  return (
    <div className="profile-card">
      <h2 className="history-title">Lịch sử đăng ký khóa học</h2>
      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Mã khóa học</th>
              <th>Tên khóa học</th>
              <th>Ngày đăng ký</th>
              <th>Học phí</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {courseHistory.map((course, index) => (
              <tr key={index}>
                <td>{course.courseId}</td>
                <td>{course.courseName}</td>
                <td>{course.registerDate}</td>
                <td>{course.fee} đ</td>
                <td>
                  <span className={`status-badge ${course.status === 'Đã xác nhận' ? 'confirmed' : 'pending'}`}>
                    {course.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CourseHistory