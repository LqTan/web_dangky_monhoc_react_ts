import React, { useState, useEffect } from 'react'
import { fetchCourses, Course } from '../../services/apis/courseAPI'
import { fetchCourseCategories, CategoryData } from '../../services/apis/courseCategoryAPI'
import '../../styles/pages/searchCourses/SearchCourses.css'
import { useNavigate } from 'react-router-dom'

const SearchCourses = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    return imagePath.replace('public://', 'http://course-management.lndo.site/sites/default/files/');
  }

  const handleCourseClick = (courseCode: string) => {
    navigate(`/courses/${courseCode}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, categoriesData] = await Promise.all([
          fetchCourses(),
          fetchCourseCategories()
        ])
        setCourses(coursesData)
        setCategories(categoriesData)
        setFilteredCourses(coursesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || course.training_program_tid === selectedCategory
      return matchesSearch && matchesCategory
    })
    setFilteredCourses(filtered)
  }, [searchTerm, selectedCategory, courses])

  return (
    <div className="search_course-container">
      <div className="search_course-header">
        <h1>Tra cứu khóa học</h1>
        <div className="search_course-filters">
          <div className="search_course-input">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="search_course-category-select"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.tid} value={category.tid}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="search_course-loading">
          <i className="bi bi-hourglass-split"></i>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="search_course-grid">
          {filteredCourses.map((course) => (
            <div 
              key={course.field_course_code} 
              className="search_course-card"
              onClick={() => handleCourseClick(course.field_course_code)}
              role="button"
              tabIndex={0}
            >
              <div className="search_course-image">
                <img src={getImageUrl(course.field_course_thumbnail)} alt={course.title} />
              </div>
              <div className="search_course-content">
                <h3>{course.title}</h3>
                <p className="search_course-code">Mã khóa học: {course.field_course_code}</p>
                <p className="search_course-category">
                  {categories.find(cat => cat.tid === course.training_program_tid)?.name}
                </p>
                <p className="search_course-fee">
                  Học phí: {parseInt(course.field_course_tuition_fee).toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            </div>
          ))}
          
          {filteredCourses.length === 0 && (
            <div className="search_course-no-results">
              <i className="bi bi-emoji-frown"></i>
              <p>Không tìm thấy khóa học phù hợp</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchCourses