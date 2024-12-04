import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../styles/pages/courseDetail/CourseDetail.css'
import ConfirmationModal from '../../modal/ConfirmationModal'
import SuccessModal from '../../modal/SuccessModal'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleRegisterClick = () => {
    setShowConfirmModal(true)
  }

  const handleConFirmRegistation = () => {
    setShowConfirmModal(false)
    setShowSuccessModal(true)
  }

  const handleCancelRegistration = () => {
    setShowConfirmModal(false)
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    navigate('/')
  }

  const courseDetail = {
    id: 1,
    title: 'Chuyên viên Thiết kế Đồ họa & Web',
    duration: '12 - 15 tháng',
    originalPrice: '26.000.000đ',
    salePrice: '20.000.000đ',
    image: 'https://placehold.co/1200x400/4a148c/white?text=Đồ+họa+&+Web',
    description: `Khóa học Chuyên viên Thiết kế Đồ họa & Web cung cấp kiến thức toàn diện về thiết kế đồ họa và phát triển web. 
    Học viên sẽ được học các công cụ thiết kế chuyên nghiệp như Adobe Photoshop, Illustrator, các ngôn ngữ lập trình web như HTML, CSS, JavaScript.
    
    Sau khóa học, học viên có thể:
    - Thiết kế giao diện website chuyên nghiệp
    - Xây dựng bộ nhận diện thương hiệu
    - Thiết kế ấn phẩm quảng cáo
    - Làm việc độc lập hoặc theo nhóm`,
    classes: [
      {
        classCode: 'DH001',
        instructor: 'Nguyễn Văn A',
        schedule: 'Thứ 2, 4, 6',
        time: '7:30 - 9:30',
        room: 'A.101',
        capacity: '35/40'
      },
      {
        classCode: 'DH002',
        instructor: 'Trần Thị B',
        schedule: 'Thứ 3, 5, 7',
        time: '9:45 - 11:45',
        room: 'A.102',
        capacity: '28/40'
      },
      {
        classCode: 'DH003',
        instructor: 'Lê Văn C',
        schedule: 'Thứ 2, 4, 6',
        time: '13:30 - 15:30',
        room: 'A.103',
        capacity: '32/40'
      }
    ]
  }

  return (
    <div className="course-detail-container">
      <div className="course-hero">
        <img src={courseDetail.image} alt={courseDetail.title} />
      </div>

      <div className="course-detail-content">
        <div className="course-header">
          <h1>{courseDetail.title}</h1>
          <div className="course-meta">
            <div className="duration">
              <i className="bi bi-clock"></i>
              <span>{courseDetail.duration}</span>
            </div>
            <div className="price">
              <span className="original">{courseDetail.originalPrice}</span>
              <span className="sale">{courseDetail.salePrice}</span>
            </div>
          </div>
        </div>

        <div className="course-description">
          <h2>Mô tả khóa học</h2>
          <div className="description-content">
            {courseDetail.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="course-classes">
          <h2>Lớp học đang mở</h2>
          <div className="classes-table-container">
            <table className="classes-table">
              <thead>
                <tr>
                  <th>Mã lớp</th>
                  <th>Giảng viên</th>
                  <th>Lịch học</th>
                  <th>Thời gian</th>
                  <th>Phòng</th>
                  <th>Sĩ số</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {courseDetail.classes.map((classItem) => (
                  <tr key={classItem.classCode}>
                    <td>{classItem.classCode}</td>
                    <td>{classItem.instructor}</td>
                    <td>{classItem.schedule}</td>
                    <td>{classItem.time}</td>
                    <td>{classItem.room}</td>
                    <td>{classItem.capacity}</td>
                    <td>
                      <button className="register-button" onClick={handleRegisterClick}>Đăng ký</button>
                      <ConfirmationModal
                        isOpen={showConfirmModal}
                        title="Đăng ký khóa học"
                        message="Bạn có chắc chắn muốn đăng ký khóa học này?"
                        onConfirm={handleConFirmRegistation}
                        onCancel={handleCancelRegistration}
                      />
                      <SuccessModal
                        isOpen={showSuccessModal}
                        onClose={handleSuccessClose}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail