import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/landingPage/LandingPage.css';

const Login = () => {
  return (
    <div className="landing-container">
      <div className="landing-card">
        {/* Logo */}
        <div className="landing-logo-container">
          <i className="bi bi-mortarboard-fill"></i>
        </div>

        {/* Heading */}
        <h1 className="landing-welcome-text">Chào mừng đến với Trung tâm Tin học</h1>
        <h2 className="landing-sub-heading">Ngoại ngữ ĐHSPTPHCM</h2>
        <p className="landing-description">Nơi bạn bắt đầu hành trình học tập và phát triển kỹ năng!</p>

        {/* Features Grid */}
        <div className="landing-features-grid">
          <div className="landing-feature-box">
            <i className="bi bi-laptop"></i>
            <h3>Khóa học Tin học</h3>
            <p>Đa dạng các khóa học từ cơ bản đến nâng cao</p>
          </div>

          <div className="landing-feature-box">
            <i className="bi bi-globe"></i>
            <h3>Ngoại ngữ</h3>
            <p>Chương trình học theo chuẩn quốc tế</p>
          </div>

          <div className="landing-feature-box">
            <i className="bi bi-shield-check"></i>
            <h3>Chứng chỉ</h3>
            <p>Chứng chỉ được công nhận toàn quốc</p>
          </div>
        </div>

        {/* Stats */}
        <div className="landing-stats-container">
          <div className="landing-stat-item">
            <span className="landing-stat-number">1000+</span>
            <span className="landing-stat-label">Học viên</span>
          </div>
          <div className="landing-stat-item">
            <span className="landing-stat-number">50+</span>
            <span className="landing-stat-label">Khóa học</span>
          </div>
          <div className="landing-stat-item">
            <span className="landing-stat-number">20+</span>
            <span className="landing-stat-label">Giảng viên</span>
          </div>
        </div>

        {/* Action Buttons */}
        <Link to="/register" className="landing-register-button">
          ĐĂNG KÝ NGAY
        </Link>
        <Link to="/login" className="landing-login-link">
          ĐĂNG NHẬP
        </Link>
      </div>
    </div>
  );
};

export default Login;