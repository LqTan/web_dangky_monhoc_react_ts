import React from 'react'
import '../../styles/components/footer/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Địa chỉ */}
          <div className="footer-section">
            <h3 className="footer-title">ĐỊA CHỈ</h3>
            <div className="footer-info">
              <i className="bi bi-geo-alt"></i>
              <p>Trụ sở chính: 280 An Dương Vương, Phường 4, Quận 5, Thành Phố Hồ Chí Minh</p>
            </div>
          </div>

          {/* Liên hệ */}
          <div className="footer-section">
            <h3 className="footer-title">LIÊN HỆ</h3>
            <div className="footer-info">
              <i className="bi bi-envelope"></i>
              <p>Email: phongtctc@hcmue.edu.vn</p>
            </div>
            <div className="footer-info">
              <i className="bi bi-telephone"></i>
              <p>Hotline: 028 - 38352020</p>
            </div>
          </div>

          {/* Fanpage */}
          <div className="footer-section">
            <h3 className="footer-title">FANPAGE FB</h3>
            <div className="footer-info">
              <i className="bi bi-facebook"></i>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                Fanpage Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer