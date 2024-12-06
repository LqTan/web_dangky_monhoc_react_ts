import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/pages/allCourses/AllCourses.css'
import { Course, fetchCourses } from '../../services/apis/courseAPI'
import { fetchCourseCategories } from '../../services/apis/courseCategoryAPI'

interface CategoryData {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

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
  const [selectedCategory, setSelectedCategory] = useState('data-analysis-microsoft')
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryData = await fetchCourseCategories()
        setCategories(categoryData)
        if (categoryData.length > 0) {
          setSelectedCategory(categoryData[0].id)
        }

        const courseData = await fetchCourses()
        setCourses(courseData)
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }

    loadData()
  }, [])

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)
  const filteredCourses = courses.filter(course => {
    const matchesCategory = course.categoryId === selectedCategory
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && (searchTerm === '' || matchesSearch)
  })

  // const categories = [
  //   {
  //     id: 'data-analysis-microsoft',
  //     icon: 'bi bi-microsoft',
  //     name: 'Data Analysis - Microsoft Platform',
  //     courses: [
  //       {
  //         id: 1,
  //         title: 'Data Analysis Certificate (Excel & PowerBI)',
  //         duration: '3 tháng',
  //         originalPrice: '6.000.000đ',
  //         salePrice: '5.400.000đ',
  //         image: 'https://placehold.co/600x400/4a148c/white?text=Excel+%26+PowerBI'
  //       },
  //       {
  //         id: 2,
  //         title: 'Data Analysis & Visualization with Power BI (Basic to Advanced)',
  //         duration: '2 tháng',
  //         originalPrice: '4.500.000đ',
  //         salePrice: '4.000.000đ',
  //         image: 'https://placehold.co/600x400/4a148c/white?text=Power+BI'
  //       }
  //     ]
  //   },
  //   {
  //     id: 'data-analysis-google',
  //     icon: 'bi bi-google',
  //     name: 'Data Analysis - Google Platform',
  //     courses: [
  //       {
  //         id: 3,
  //         title: 'Google Data Analytics Professional Certificate',
  //         duration: '4 tháng',
  //         originalPrice: '7.000.000đ',
  //         salePrice: '6.300.000đ',
  //         image: 'https://placehold.co/600x400/4a148c/white?text=Google+Analytics'
  //       }
  //     ]
  //   },
  //   {
  //     id: 'data-science',
  //     icon: 'bi bi-cpu',
  //     name: 'Chuyên Đề Data Science & Machine Learning',
  //     courses: [
  //       {
  //         id: 4,
  //         title: 'Machine Learning with Azure',
  //         duration: '6 tháng',
  //         originalPrice: '12.000.000đ',
  //         salePrice: '10.800.000đ',
  //         image: 'https://placehold.co/600x400/4a148c/white?text=Machine+Learning'
  //       }
  //     ]
  //   },
  //   {
  //     id: 'programming',
  //     icon: 'bi bi-code-slash',
  //     name: 'Lập trình ứng dụng',
  //     courses: []
  //   },
  //   {
  //     id: 'testing',
  //     icon: 'bi bi-bug',
  //     name: 'Kiểm thử phần mềm',
  //     courses: []
  //   },
  //   {
  //     id: 'devops',
  //     icon: 'bi bi-gear',
  //     name: 'Master DevOps Engineer',
  //     courses: []
  //   },
  //   {
  //     id: 'network',
  //     icon: 'bi bi-hdd-network',
  //     name: 'Mạng máy tính',
  //     courses: []
  //   },
  //   {
  //     id: 'office',
  //     icon: 'bi bi-pc-display',
  //     name: 'Tin học văn phòng',
  //     courses: []
  //   },
  //   {
  //     id: 'graphics',
  //     icon: 'bi bi-brush',
  //     name: 'Đồ họa đa truyền thông',
  //     courses: []
  //   },
  //   {
  //     id: 'international',
  //     icon: 'bi bi-globe',
  //     name: 'Tin học Quốc tế',
  //     courses: []
  //   }
  // ]
  

  return (
    <div className="all-courses-container">
      <div className="courses-sidebar">
        <h3>Chương trình đào tạo</h3>
        <div className="category-list">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <i className={categoryIcons[category.name] || 'bi bi-folder'}></i>
              <span>{category.name}</span>
              {/* {category.courses.length > 0 && (
                <span className="course-count">{category.courses.length}</span>
              )} */}
              <span className="course-count">
                {courses.filter(course => course.categoryId === category.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="courses-content">
        <div className="courses-header">
          <h2>{selectedCategoryData?.name}</h2>
          <div className="search-box">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-search">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="courses-grid">
        {filteredCourses.map(course => (
            <div key={course.courseCode} className="course-card">
              <div className="course-image">
                <img src={course.imageUrl} alt={course.name} />
              </div>
              <div className="course-info">
                <h3>
                  <Link to={`/courses/${course.courseCode}`}>{course.name}</Link>
                </h3>
                <div className="course-code">
                  <i className="bi bi-code-slash"></i>
                  <span>{course.courseCode}</span>
                </div>
                <div className="course-price">
                  <i className="bi bi-currency-exchange"></i>
                  <span>{new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(course.price)}</span>
                </div>
                <Link to={`/courses/${course.courseCode}`} className="view-detail-button">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && (
            <div className="no-courses">
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