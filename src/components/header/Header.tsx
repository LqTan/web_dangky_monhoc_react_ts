import React from 'react'
import '../../styles/components/header/Header.css'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          TTTH DHSP TPHCM
        </Link>
        
        <div className="navbar-links">
          <Link to="/search" className="nav-link">
            TRA CỨU
          </Link>
          <Link to="/all-courses" className="nav-link">
            TẤT CẢ KHÓA HỌC
          </Link>
          <Link to="/student-info" className="nav-link">
            THÔNG TIN HỌC VIÊN
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Header