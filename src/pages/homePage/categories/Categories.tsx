import React from 'react'
import '../../../styles/pages/homePage/Categories.css'
import { Link } from 'react-router-dom'

const Categories = () => {
  const categories = [
    {
      icon: "bi bi-mortarboard",
      title: "CỔNG THÔNG TIN SINH VIÊN",
      path: "/student-portal"
    },
    {
      icon: "bi bi-journal-text",
      title: "SỔ TAY SINH VIÊN",
      path: "/student-handbook"
    },
    {
      icon: "bi bi-heart",
      title: "CẨM NANG CỐ VẤN",
      path: "/advisor-guide"
    },
    {
      icon: "bi bi-people",
      title: "SINH HOẠT CÔNG DÂN",
      path: "/civic-activities"
    },
    {
      icon: "bi bi-file-text",
      title: "BIỂU MẪU CẦN THIẾT",
      path: "/forms"
    }
  ]

  return (
    <div className="categories-container">
      <div className="categories-grid">
        {categories.map((category, index) => (
          <Link to={category.path} key={index} className="category-card">
            <i className={`${category.icon} category-icon`}></i>
            <h3 className="category-title">{category.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Categories