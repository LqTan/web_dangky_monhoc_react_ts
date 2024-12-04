import React, { useState } from 'react'
import '../../../styles/pages/studentInfo/studyResults/StudyResults.css'

const StudyResults = () => {
  const [selectedSemester, setSelectedSemester] = useState('all')

  const studyResults = [
    {
      courseId: 'CS101',
      courseName: 'Tin học văn phòng',
      semester: 'HK1 2023-2024',
      midtermScore: 8.5,
      finalScore: 8.0,
      averageScore: 8.2,
      status: 'Đạt'
    },
    {
      courseId: 'ENG201',
      courseName: 'Tiếng Anh B1',
      semester: 'HK1 2023-2024',
      midtermScore: 7.5,
      finalScore: 8.5,
      averageScore: 8.0,
      status: 'Đạt'
    },
    {
      courseId: 'CS102',
      courseName: 'Lập trình cơ bản',
      semester: 'HK2 2023-2024',
      midtermScore: '-',
      finalScore: '-',
      averageScore: '-',
      status: 'Đang học'
    }
  ]

  return (
    <div className="profile-card">
      <div className="results-header">
        <h2 className="results-title">Kết quả học tập</h2>
        <div className="semester-select">
          <select 
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="all">Tất cả học kỳ</option>
            <option value="HK1-2023-2024">HK1 2023-2024</option>
            <option value="HK2-2023-2024">HK2 2023-2024</option>
          </select>
        </div>
      </div>
      <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>Mã môn</th>
              <th>Tên môn học</th>
              <th>Học kỳ</th>
              <th>Điểm giữa kỳ</th>
              <th>Điểm cuối kỳ</th>
              <th>Điểm trung bình</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {studyResults.map((result, index) => (
              <tr key={index}>
                <td>{result.courseId}</td>
                <td>{result.courseName}</td>
                <td>{result.semester}</td>
                <td>{result.midtermScore}</td>
                <td>{result.finalScore}</td>
                <td>{result.averageScore}</td>
                <td>
                  <span className={`status-badge ${result.status === 'Đạt' ? 'passed' : 'in-progress'}`}>
                    {result.status}
                  </span>
                </td>
                <td>
                  <button className="details-button">
                    <i className="bi bi-eye"></i> Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudyResults