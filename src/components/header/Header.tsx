import React from 'react'
import '../../styles/components/header/Header.css'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa' // Thêm icon search

const Header = () => {
  return (
    <nav className="navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          TTTH DHSP TPHCM
        </Link>

        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Tra cứu..." 
              style={{WebkitAppearance: 'none'}}
            />
          </div>
        </div>
        
        <div className="navbar-links">
          <Link to="/all-courses" className="nav-link">
            <i className="fas fa-book-open"></i>
            Tất cả môn học
          </Link>
          <Link to="/student-info" className="nav-link">
            <i className="fas fa-user"></i>
            Thông tin học viên
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Header