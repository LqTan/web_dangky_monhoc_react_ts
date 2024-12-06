import React, { useEffect, useState } from 'react'
import Header from '../../../components/header/Header'
import Sidebar from '../sidebar/Sidebar'
import '../../../styles/pages/studentInfo/studentProfile/StudentInfo.css'
import CourseHistory from '../courseHistory/CourseHistory'
import ClassSchedule from '../classSchedule/ClassSchedule'
import ExamSchedule from '../examSchedule/ExamSchedule'
import StudyResults from '../studyResults/StudyResults'
import Certificates from '../certificates/Certificates'
import TuitionFees from '../tuitionFees/TuitionFees'
import { UserProfile } from '../../../services/apis/userProfileAPI'
import { getUserProfile } from '../../../services/apis/userProfileAPI'

const StudentInfo = () => {
  const [selectedComponent, setSelectedComponent] = useState('Thông tin cá nhân')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem('user') || '{}').id
        if (!userId) {
          throw new Error('User ID not found')
        }
        const data = await getUserProfile(userId)
        setProfile(data)
      } catch (err) {
        setError('Không thể tải thông tin người dùng')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const renderPersonalInfo = () => {
    if (loading) {
      return <div>Đang tải...</div>
    }

    if (error) {
      return <div className="error-message">{error}</div>
    }

    if (!profile) {
      return <div>Không tìm thấy thông tin người dùng</div>
    }

    return (
      <div className="profile-card">
        <div className="profile-content">
          <div className="left-section">
            <div className="avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt="avatar" />
              ) : (
                <div>{profile.fullName?.charAt(0) || 'S'}</div>
              )}
            </div>
            <button className="update-button">Cập Nhật Ảnh</button>
          </div>
          <div className="right-section">
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên</label>
                <input type="text" value={profile.fullName || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Giới tính</label>
                <input type="text" value={profile.gender || ''} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ngày sinh</label>
                <input 
                  type="date" 
                  value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ''} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>CMND/CCCD</label>
                <input type="text" value={profile.citizenId || ''} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nghề nghiệp</label>
                <input type="text" value={profile.occupation || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Nơi làm việc</label>
                <input type="text" value={profile.workplace || ''} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại</label>
                <input type="text" value={profile.phoneNumber || ''} readOnly />
              </div>
            </div>
          </div>
        </div>
        <div className="button-container">
          <button className="save-button">Lưu Thay Đổi</button>
        </div>
      </div>
    )
  }

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Thông tin cá nhân':
        return renderPersonalInfo()
      case 'Lịch sử đăng ký':
        return <CourseHistory />
      case 'Thông tin môn học':
        return <div className="profile-card">Thông tin môn học</div>
      case 'Lịch học':
        return <ClassSchedule />
      case 'Lịch thi':
        return <ExamSchedule />
      case 'Kết quả học tập':
        return <StudyResults />
      case 'Chứng chỉ':
        return <Certificates />
      case 'Học phí':
        return <TuitionFees />
      default:
        return renderPersonalInfo()
    }
  }

  return (
    <div>      
      <div className="student-info-wrapper">
        <div className="container">
          <div className="student-info-container">
            <Sidebar onSelect={setSelectedComponent} />
            <div className="content">
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentInfo