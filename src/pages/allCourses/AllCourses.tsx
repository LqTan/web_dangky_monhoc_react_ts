import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/pages/allCourses/AllCourses.css'
import { Course, fetchCourses } from '../../services/apis/courseAPI'
import { CategoryData, fetchCourseCategories } from '../../services/apis/courseCategoryAPI'

// Mapping icons cho các danh mục
const categoryIcons: { [key: string]: string } = {
  'Data Analysis - Microsoft Platform': 'bi bi-microsoft',
  'Data Analysis - Google Platform': 'bi bi-google',
  'Chuyên Đề Data Science & Machine Learning': 'bi bi-cpu',
  'Lập trình ứng dụng': 'bi bi-code-slash',
  'Kiểm thử phần mềm': 'bi bi-bug',
  'Master DevOps Engineer': 'bi bi-gear',
  'Mạng máy tính': 'bi bi-hdd-network',
  'Tin học văn phòng': 'bi bi-pc-display',
  'Đồ họa đa truyền thông': 'bi bi-brush',
  'Tin học Quốc tế': 'bi bi-globe',
}

const AllCourses = () => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryData = await fetchCourseCategories()
        setCategories(categoryData)
        if (categoryData.length > 0) {
          setSelectedCategory(categoryData[0].name)
        }

        const courseData = await fetchCourses()
        setCourses(courseData)
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }

    loadData()
  }, [])

  const selectedCategoryData = categories.find(cat => cat.name === selectedCategory)
  const filteredCourses = courses.filter(course => {
    const matchesCategory = course.training_program_tid === selectedCategoryData?.tid
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && (searchTerm === '' || matchesSearch)
  })

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return ''
    return imagePath.replace('public://', 'http://course-management.lndo.site/sites/default/files/')
  }

  return (
    <div className="searching-all-courses-container">
      <div className="searching-courses-sidebar">
        <h3>Chương trình đào tạo</h3>
        <div className="searching-category-list">
          {categories.map(category => (
            <button
              key={category.tid}
              className={`searching-category-item ${selectedCategory === category.name ? 'searching-active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <i className={categoryIcons[category.name] || 'bi bi-folder'}></i>
              <span>{category.name}</span>
              <span className="searching-course-count">
                {courses.filter(course => course.training_program_tid === category.tid).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="searching-courses-content">
        <div className="searching-courses-header">
          <h2>{selectedCategory}</h2>
          <div className="searching-search-box">
            <div className="searching-input-group">
              <input 
                type="text" 
                className="searching-form-control" 
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="searching-btn-search">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="searching-courses-grid">
          {filteredCourses.map(course => (
            <div key={course.field_course_code} className="searching-course-card">
              <div className="searching-course-image">
                <img src={getImageUrl(course.field_course_thumbnail)} alt={course.title} />
              </div>
              <div className="searching-course-info">
                <h3>
                  <Link to={`/courses/${course.field_course_code}`}>{course.title}</Link>
                </h3>
                <div className="searching-course-code">
                  <i className="bi bi-code-slash"></i>
                  <span>{course.field_course_code}</span>
                </div>
                <div className="searching-course-price">
                  <i className="bi bi-currency-exchange"></i>
                  <span>{new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(parseFloat(course.field_course_tuition_fee))}</span>
                </div>
                <Link to={`/courses/${course.field_course_code}`} className="searching-view-detail-button">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && (
            <div className="searching-no-courses">
              <i className="bi bi-info-circle"></i>
              <p>Chưa có khóa học nào trong danh mục này</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllCourses