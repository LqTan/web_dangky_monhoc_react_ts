import React, { useEffect, useState } from 'react'
import '../../../styles/pages/studentInfo/studyResults/StudyResults.css'
import { fetchScores, ScoreInfo } from '../../../services/apis/scoreAPI'
import { fetchSemesters, Semester } from '../../../services/apis/semesterAPI'
import { useNavigate } from 'react-router-dom'

const StudyResults = () => {
  const [studyResults, setStudyResults] = useState<ScoreInfo[]>([])
  const [filteredResults, setFilteredResults] = useState<ScoreInfo[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id
        if (!userId) {
          throw new Error('Không tìm thấy thông tin người dùng')
        }

        // Fetch semesters
        const semesterData = await fetchSemesters()
        setSemesters(semesterData)

        // Fetch scores
        const scores = await fetchScores()
        const userScores = scores.filter(score => score.uid === userId)
        setStudyResults(userScores)
        setFilteredResults(userScores)
        
      } catch (err: any) {
        if (err.response?.status === 403) {
          navigate('/login')
        } else {
          setError('Không thể tải kết quả học tập. Vui lòng thử lại sau.')
        }
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate])

  useEffect(() => {
    if (selectedYear === 'all') {
      setFilteredResults(studyResults)
    } else {
      const filtered = studyResults.filter(result => {
        // Thêm logic lọc theo năm học tại đây
        return true // Tạm thời return true để hiển thị tất cả
      })
      setFilteredResults(filtered)
    }
  }, [selectedYear, studyResults])

  if (loading) return <div className="profile-card">Đang tải...</div>
  if (error) return <div className="profile-card error-message">{error}</div>

  return (
    <div className="profile-card">
      <div className="results-header">
        <h2 className="results-title">Kết quả học tập</h2>
        <div className="semester-select">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="all">Tất cả năm học</option>
            {semesters.map((semester) => (
              <option 
                key={semester.tid} 
                value={semester.name.split('(')[1].split(')')[0]}
              >
                {semester.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="empty-message">Chưa có kết quả học tập nào</div>
      ) : (
        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>Mã môn</th>
                <th>Tên môn học</th>
                <th>Điểm giữa kỳ</th>
                <th>Điểm cuối kỳ</th>
                <th>Điểm trung bình</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.field_course_code}</td>
                  <td>{result.title.replace('[Điểm] ', '')}</td>
                  <td>{result.field_midterm}</td>
                  <td>{result.field_final}</td>
                  <td>{result.field_average}</td>
                  <td>
                    <span className={`status-badge ${result.field_state === 'Đậu' ? 'passed' : 'in-progress'}`}>
                      {result.field_state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default StudyResults