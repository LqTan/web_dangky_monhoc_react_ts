import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../../../styles/pages/homePage/CourseList.css'

const CourseList = () => {
  const [selectedCategory, setSelectedCategory] = useState('Đồ họa')
  const categoriesRef = useRef<HTMLDivElement>(null)

  const categories = [
    'Đồ họa',
    'Thiết kế Web - SEO',
    'Lập trình ứng dụng',
    'Lập trình Mobile',
    'Data Science',
    'Data Analysis',
    'DevOps Engineer',
    'Mạng máy tính',
    'Tin học văn phòng',
    'Tin học Quốc tế',
    'Kiểm thử phần mềm',
    'Khóa học cho thiếu niên'
  ]

  const courses = [
    {
      id: 1,
      title: 'Chuyên viên Thiết kế Đồ họa & Web',
      duration: '12 - 15 tháng',
      originalPrice: '26.000.000đ',
      salePrice: '20.000.000đ',
      image: 'https://placehold.co/600x400/4a148c/white?text=Đồ+họa+&+Web',
      category: 'Đồ họa',
      isNew: true
    },
    {
      id: 2,
      title: 'Chuyên viên Thiết kế Đồ họa & Nội thất',
      duration: '12 - 15 tháng',
      originalPrice: '26.000.000đ',
      salePrice: '20.450.000đ',
      image: 'https://placehold.co/600x400/4a148c/white?text=Đồ+họa+&+Nội+thất',
      category: 'Đồ họa'
    },
    {
      id: 3,
      title: 'Kỹ thuật viên Thiết kế Đồ họa',
      duration: '3-5 tháng',
      originalPrice: '7.800.000đ',
      salePrice: '6.700.000đ',
      image: 'https://placehold.co/600x400/4a148c/white?text=Thiết+kế+Đồ+họa',
      category: 'Đồ họa'
    },
    {
      id: 4,
      title: 'Chuyên viên Digital Painting',
      duration: '12 - 15 tháng',
      originalPrice: '29.200.000đ',
      salePrice: '22.450.000đ',
      image: 'https://placehold.co/600x400/4a148c/white?text=Digital+Painting',
      category: 'Đồ họa',
      isNew: true
    }
  ]

  const scroll = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = 200
      const newScrollLeft = direction === 'left' 
        ? categoriesRef.current.scrollLeft - scrollAmount
        : categoriesRef.current.scrollLeft + scrollAmount
      
      categoriesRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const filteredCourses = courses.filter(course => course.category === selectedCategory)

  return (
    <div className="course-list-container">
      <h2 className="section-title">Khóa học nổi bật</h2>
      <div className="course-categories">
        <button 
          className="scroll-button left"
          onClick={() => scroll('left')}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="categories-scroll" ref={categoriesRef}>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <button 
          className="scroll-button right"
          onClick={() => scroll('right')}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-image">
              <img src={course.image} alt={course.title} />
              {course.isNew && <span className="new-badge">NEW</span>}
            </div>
            <div className="course-info">
              <h3>
                <Link to={`/courses/${course.id}`}>{course.title}</Link>
              </h3>
              <div className="course-duration">
                <i className="bi bi-clock"></i>
                <span>{course.duration}</span>
              </div>
              <div className="course-price">
                <span className="original-price">{course.originalPrice}</span>
                <span className="sale-price">{course.salePrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="view-all-container">
        <Link to="/courses" className="view-all-button">
          Xem toàn bộ môn học
        </Link>
      </div>
    </div>
  )
}

export default CourseList