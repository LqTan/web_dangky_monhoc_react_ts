import React, { useState } from 'react'
import '../../styles/pages/registerCourse/RegisterCourse.css'

const RegisterCourse: React.FC = () => {
    return (
      <div className="register-course-container">
        <h2>Đăng ký môn học</h2>
        
        <div className="course-category">
          <h4>Danh sách môn học</h4>
          <div className="filter-buttons">
            <button className="btn btn-primary me-2">ALL</button>
            <button className="btn btn-outline-primary me-2">TIN HỌC CƠ BẢN</button>
            <button className="btn btn-outline-primary me-2">NGOẠI NGỮ</button>
            <button className="btn btn-outline-primary">CNTT NÂNG CAO</button>
          </div>
        </div>
  
        <div className="course-list">
          <div className="course-item">
            <div className="course-info">
              <h5>Tin học văn phòng (CS101)</h5>
              <p className="mb-1">Số tín chỉ: 3</p>
              <p className="mb-0">Khóa học về các ứng dụng văn phòng cơ bản</p>
            </div>
            <div className="course-actions">
              <button className="btn btn-success me-2">Đang mở</button>
              <button className="btn btn-primary">ĐĂNG KÝ</button>
            </div>
          </div>
          <hr />
  
          <div className="course-item">
            <div className="course-info">
              <h5>Tiếng Anh B1 (ENG201)</h5>
              <p className="mb-1">Số tín chỉ: 4</p>
              <p className="mb-1">Khóa học tiếng Anh trình độ B1</p>
              <p className="prerequisite mb-0">Môn học tiên quyết: ENG101</p>
            </div>
            <div className="course-actions">
              <button className="btn btn-success me-2">Đang mở</button>
              <button className="btn btn-primary">ĐĂNG KÝ</button>
            </div>
          </div>
          <hr />
  
          <div className="course-item">
            <div className="course-info">
              <h5>Lập trình nâng cao (CS301)</h5>
              <p className="mb-1">Số tín chỉ: 4</p>
              <p className="mb-1">Khóa học lập trình nâng cao</p>
              <p className="prerequisite mb-0">Môn học tiên quyết: CS101</p>
            </div>
            <div className="course-actions">
              <button className="btn btn-success me-2">Đang mở</button>
              <button className="btn btn-primary">ĐĂNG KÝ</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default RegisterCourse;