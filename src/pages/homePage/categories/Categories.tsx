import React from 'react'
import '../../../styles/pages/homePage/Categories.css'
import { Link } from 'react-router-dom'

const Categories = () => {
  const categories = [
    {
      icon: "bi bi-search",
      title: "Tra cứu môn học",
      subtitle: "Tìm kiếm thông tin về các môn học",
      path: "/search-courses"
    },
    {
      icon: "bi bi-calendar-check",
      title: "Đăng ký môn học",
      subtitle: "Đăng ký các môn học trong học kỳ",
      path: "/register-courses"
    },
    {
      icon: "bi bi-calendar3",
      title: "Lịch học - Lịch thi",
      subtitle: "Xem lịch học và lịch thi",
      path: "/schedule"
    },
    {
      icon: "bi bi-file-text",
      title: "Kết quả học tập",
      subtitle: "Xem điểm và kết quả học tập",
      path: "/results"
    }
  ]
  
  // Trong phần return, thêm subtitle
  return (
    <div className="categories-container">
      <div className="categories-grid">
        {categories.map((category, index) => (
          <Link to={category.path} key={index} className="category-card">
            <i className={`${category.icon} category-icon`}></i>
            <h3 className="category-title">{category.title}</h3>
            <p className="category-subtitle">{category.subtitle}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Categories