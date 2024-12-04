import React, { useState } from 'react'
import Header from '../../../components/header/Header'
import Sidebar from '../sidebar/Sidebar'
import '../../../styles/pages/studentInfo/studentProfile/StudentInfo.css'
import CourseHistory from '../courseHistory/CourseHistory'
import ClassSchedule from '../classSchedule/ClassSchedule'
import ExamSchedule from '../examSchedule/ExamSchedule'
import StudyResults from '../studyResults/StudyResults'
import Certificates from '../certificates/Certificates'
import TuitionFees from '../tuitionFees/TuitionFees'

const StudentInfo = () => {
  const [selectedComponent, setSelectedComponent] = useState('Thông tin cá nhân')

  const renderPersonalInfo = () => {
    return (
      <div className="profile-card">
        <div className="profile-content">
          <div className="left-section">
            <div className="avatar">S</div>
            <button className="update-button">Cập Nhật Ảnh</button>
          </div>
          <div className="right-section">
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên</label>
                <input type="text" value="Nguyễn Văn A" readOnly />
              </div>
              <div className="form-group">
                <label>Mã số học viên</label>
                <input type="text" value="HV001" readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value="example@email.com" readOnly />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input type="text" value="0123456789" readOnly />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Địa chỉ</label>
              <input type="text" value="123 Đường ABC, Quận XYZ, TP.HCM" readOnly />
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