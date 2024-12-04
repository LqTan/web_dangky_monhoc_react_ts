import React from 'react'
import '../../../styles/pages/homePage/Carousel.css'

const Carousel = () => {
  const carouselItems = [
    {
      id: 1,
      imageUrl: 'https://picsum.photos/1200/400?random=1',
      title: 'Chào mừng đến với TTTH DHSP TPHCM',
      description: 'Trung tâm tin học - Đại học Sư phạm TP.HCM'
    },
    {
      id: 2,
      imageUrl: 'https://picsum.photos/1200/400?random=2',
      title: 'Đăng ký môn học',
      description: 'Đăng ký các khóa học trực tuyến'
    },
    {
      id: 3,
      imageUrl: 'https://picsum.photos/1200/400?random=3',
      title: 'Thông tin học viên',
      description: 'Tra cứu thông tin và kết quả học tập'
    }
  ]

  return (
    <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        {carouselItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Carousel items */}
      <div className="carousel-inner">
        {carouselItems.map((item, index) => (
          <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <img
              src={item.imageUrl}
              className="d-block w-100"
              alt={item.title}
            />
            <div className="carousel-caption">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}

export default Carousel