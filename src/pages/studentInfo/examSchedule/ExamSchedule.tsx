import React from 'react'
import '../../../styles/pages/studentInfo/examSchedule/ExamSchedule.css'

const ExamSchedule = () => {
  const examSchedules = [
    {
      courseId: 'CS101',
      courseName: 'Tin học văn phòng',
      examDate: '20/3/2024',
      examTime: '18:00 - 19:30',
      room: 'A101',
      type: 'Cuối kỳ',
      status: 'Sắp thi'
    },
    {
      courseId: 'ENG201',
      courseName: 'Tiếng Anh B1',
      examDate: '25/3/2024',
      examTime: '18:00 - 20:00',
      room: 'B203',
      type: 'Giữa kỳ',
      status: 'Sắp thi'
    }
  ]

  return (
    <div className="profile-card">
      <h2 className="exam-title">Lịch thi</h2>
      <div className="exam-table">
        <table>
          <thead>
            <tr>
              <th>Mã môn</th>
              <th>Tên môn học</th>
              <th>Ngày thi</th>
              <th>Giờ thi</th>
              <th>Phòng thi</th>
              <th>Loại thi</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {examSchedules.map((exam, index) => (
              <tr key={index}>
                <td>{exam.courseId}</td>
                <td>{exam.courseName}</td>
                <td>{exam.examDate}</td>
                <td>{exam.examTime}</td>
                <td>{exam.room}</td>
                <td>{exam.type}</td>
                <td>
                  <span className="status-badge upcoming">
                    {exam.status}
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

export default ExamSchedule