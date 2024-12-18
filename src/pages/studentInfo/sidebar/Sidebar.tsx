import React from 'react'
import '../../../styles/pages/studentInfo/sidebar/Sidebar.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ onSelect }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: 'bi bi-person', label: 'Thông tin cá nhân' },
    { icon: 'bi bi-clock-history', label: 'Lịch sử đăng ký' },
    // { icon: 'bi bi-book', label: 'Thông tin môn học' },
    { icon: 'bi bi-calendar', label: 'Lịch học' },
    { icon: 'bi bi-calendar-check', label: 'Lịch thi' },
    { icon: 'bi bi-mortarboard', label: 'Kết quả học tập' },
    { icon: 'bi bi-clock', label: 'Chứng chỉ' },
    // { icon: 'bi bi-wallet2', label: 'Học phí' },
  ]

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} onClick={() => onSelect(item.label)}>
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </li>
        ))}
        {/* Thêm nút đăng xuất */}
        <li className="logout-item" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Đăng xuất</span>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar