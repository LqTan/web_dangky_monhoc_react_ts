import React, { useState } from 'react'
import '../../../styles/pages/homePage/News.css'

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('Thông báo chung')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Số tin tức hiển thị trên mỗi trang

  const newsItems = [
    {
      id: 1,
      title: 'THÔNG BÁO VỀ THỜI GIAN NỘP HỌC PHÍ NĂM HỌC 2024-2025',
      publishDate: '26/11/2024',
      updateDate: '26/11/2024',
      isNew: true,
      category: 'Thông báo từ phòng KHTC'
    },
    {
      id: 2,
      title: 'Thông báo về việc cung cấp thông tin để hoàn trả lệ phí đăng ký kiểm tra ngoại ngữ đầu vào năm 2024',
      publishDate: '15/11/2024',
      updateDate: '26/11/2024',
      isNew: true,
      category: 'Thông báo chung'
    },
    {
      id: 3,
      title: 'Thông báo về việc khảo sát ý kiến sinh viên về chất lượng giảng dạy',
      publishDate: '14/11/2024',
      updateDate: '14/11/2024',
      isNew: false,
      category: 'Khảo sát lấy ý kiến người học'
    },
    {
      id: 4,
      title: 'Thông báo lịch thi cuối kỳ học kỳ 1 năm học 2024-2025',
      publishDate: '13/11/2024',
      updateDate: '13/11/2024',
      isNew: false,
      category: 'Khảo thí'
    },
    {
      id: 5,
      title: 'Thông báo về việc nghỉ Tết Nguyên đán 2025',
      publishDate: '10/11/2024',
      updateDate: '10/11/2024',
      isNew: true,
      category: 'Thông báo chung'
    },
    {
      id: 6,
      title: 'Thông báo về việc đăng ký thi chứng chỉ ngoại ngữ đợt 1 năm 2025',
      publishDate: '09/11/2024',
      updateDate: '09/11/2024',
      isNew: false,
      category: 'Thông báo chung'
    },
    {
      id: 7,
      title: 'Thông báo về việc nghỉ Tết Nguyên đán 2025',
      publishDate: '10/11/2024',
      updateDate: '10/11/2024',
      isNew: true,
      category: 'Thông báo chung'
    },
    {
      id: 8,
      title: 'Thông báo về việc đăng ký thi chứng chỉ ngoại ngữ đợt 1 năm 2025',
      publishDate: '09/11/2024',
      updateDate: '09/11/2024',
      isNew: false,
      category: 'Thông báo chung'
    },
    {
      id: 9,
      title: 'Thông báo về việc nghỉ Tết Nguyên đán 2025',
      publishDate: '10/11/2024',
      updateDate: '10/11/2024',
      isNew: true,
      category: 'Thông báo chung'
    },
    {
      id: 10,
      title: 'Thông báo về việc đăng ký thi chứng chỉ ngoại ngữ đợt 1 năm 2025',
      publishDate: '09/11/2024',
      updateDate: '09/11/2024',
      isNew: false,
      category: 'Thông báo chung'
    },
  ]

  const categories = [
    'Thông báo chung',
    'Thông báo từ phòng KHTC',
    'Khảo sát lấy ý kiến người học',
    'Hành chính',
    'Đào tạo',
    'Khảo thí',
    'Công tác SV',
    'Thông báo nổi bật'
  ]

  // Lọc tin tức theo danh mục
  const filteredNews = newsItems.filter(item => item.category === selectedCategory)

  // Tính toán số trang
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)

  // Lấy tin tức cho trang hiện tại
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredNews.slice(startIndex, endIndex)
  }

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Cuộn lên đầu danh sách tin tức
    document.querySelector('.news-content')?.scrollTo(0, 0)
  }

  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5 // Số trang hiển thị tối đa trong pagination

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
              {categories.map((category, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className={selectedCategory === category ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedCategory(category)
                      setCurrentPage(1) // Reset về trang 1 khi chuyển category
                    }}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-9">
          <div className="news-header">
            <h2>{selectedCategory}</h2>
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
                getCurrentPageItems().map(item => (
                  <div key={item.id} className="news-item">
                    {item.isNew && <span className="badge-new">Mới</span>}
                    <h5><a href="#">{item.title}</a></h5>
                    <div className="news-meta">
                      Ngày đăng tin {item.publishDate} • Ngày cập nhật {item.updateDate}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-news">
                  Không có thông báo nào trong mục này
                </div>
              )}
            </div>

            {filteredNews.length > itemsPerPage && (
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