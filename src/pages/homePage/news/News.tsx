import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../../../styles/pages/homePage/News.css'

interface NewsType {
  tid: string
  name: string
}

interface NewsItem {
  nid: string
  title: string
  body: string
  field_file_upload: string
  field_term_name: string
  vid: string
}

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<NewsType[]>([])
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const itemsPerPage = 5

  // Fetch danh mục tin tức
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://course-management.lndo.site/api/news-types')
        setCategories(response.data)
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].tid)
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch tin tức theo danh mục
  useEffect(() => {
    const fetchNews = async () => {
      if (!selectedCategory) return
      try {
        const response = await axios.get(`http://course-management.lndo.site/api/news`)
        // Lọc tin tức theo danh mục được chọn
        const filteredNews = response.data.filter(
          (item: NewsItem) => item.field_term_name === categories.find(cat => cat.tid === selectedCategory)?.name
        )
        setNewsItems(filteredNews)
        setCurrentPage(1)
      } catch (error) {
        console.error('Lỗi khi tải tin tức:', error)
      }
    }
    fetchNews()
  }, [selectedCategory, categories])

  // Tính toán số trang
  const totalPages = Math.ceil(newsItems.length / itemsPerPage)

  // Lấy tin tức cho trang hiện tại
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return newsItems.slice(startIndex, endIndex)
  }

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document.querySelector('.news-content')?.scrollTo(0, 0)
  }

  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  return (
    <div className="news-container">
      <div className="row">
        <div className="col-md-3">
          <div className="news-sidebar">
            <h5>Tin tức</h5>
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category.tid}>
                  <a 
                    href="#" 
                    className={selectedCategory === category.tid ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedCategory(category.tid)
                    }}
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        <div className="col-md-9">
          <div className="news-header">
            <h2>{categories.find(cat => cat.tid === selectedCategory)?.name}</h2>
            <div className="search-box">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tìm kiếm..."
                />
                <button className="btn btn-dark" type="button">
                  <i className="bi bi-search"></i> TÌM KIẾM
                </button>
              </div>
            </div>
          </div>
  
          <div className="news-content">
            <div className="news-list">
              {getCurrentPageItems().length > 0 ? (
                getCurrentPageItems().map((item) => (
                  <div key={item.nid} className="news-item">
                    <h5>
                      <Link to={`/news/${item.nid}`}>{item.title}</Link>
                    </h5>
                    <div className="news-meta">
                      Danh mục: {item.field_term_name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-news">
                  Không có thông báo nào trong mục này
                </div>
              )}
            </div>
  
            {newsItems.length > itemsPerPage && (
              <div className="pagination-container">
                <div className="pagination">
                  <button 
                    className="page-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
  
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      className={`page-button ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
  
                  <button 
                    className="page-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default News