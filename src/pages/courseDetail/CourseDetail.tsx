import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../styles/pages/courseDetail/CourseDetail.css'
import ConfirmationModal from '../../modal/ConfirmationModal'
import SuccessModal from '../../modal/SuccessModal'
import { Course, fetchCourseByCode } from '../../services/apis/courseAPI'
import { fetchCourseCategories } from '../../services/apis/courseCategoryAPI'
import { Class, fetchClasses } from '../../services/apis/classAPI'
import { useAuth } from '../../context/AuthContext'
import { registerClass } from '../../services/apis/classRegistrationAPI'

const CourseDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('')

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        if (!id) return;
        
        // Tải thông tin khóa học
        const courseData = await fetchCourseByCode(id);
        setCourse(courseData);

        // Tải danh sách lớp học
        const classesData = await fetchClasses();
        // Lọc lớp học theo khóa học
        const filteredClasses = classesData.filter((cls: Class) => cls.courseId === id);
        setClasses(filteredClasses);

        // Tải danh sách danh mục để lấy tên danh mục
        const categories = await fetchCourseCategories();
        const category = categories.find((cat: any) => cat.id === courseData.categoryId);
        if (category) {
          setCategoryName(category.name);
        }
      } catch (error) {
        console.error('Failed to load course:', error);
      }
    };

    loadCourseData();
  }, [id]);

  const handleRegisterClick = (classCode: string) => {
    setSelectedClass(classCode)
    setShowConfirmModal(true)
  }

  const handleConFirmRegistation = async () => {
    console.log(user)
    try {
      if (!user) {
        console.error('User not logged in');
        return;
      }
      await registerClass(user.id, selectedClass);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to register class:', error);
      alert('Đăng ký lớp học thất bại!');
      setShowConfirmModal(false);
    }
  }

  const handleCancelRegistration = () => {
    setShowConfirmModal(false)
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    navigate('/')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  const formatSchedule = (schedule: number[]) => {
    const days = schedule.map(day => `Thứ ${day === 8 ? 'CN' : day}`);
    return days.join(', ');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="course-detail-container">
      <div className="course-hero">
        <img src={course.imageUrl} alt={course.name} />
      </div>

      <div className="course-detail-content">
        <div className="course-header">
          <h1>{course.name}</h1>
          <div className="course-meta">
            <div className="duration">
              <i className="bi bi-code-slash"></i>
              <span>{course.courseCode}</span>
            </div>
            <div className="course-category">
              <i className="bi bi-folder"></i>
              <span>{categoryName}</span>
            </div>
            <div className="price">
              <i className="bi bi-currency-exchange"></i>              
              <span className="original">{formatPrice(course.price)}</span>
            </div>
          </div>
        </div>

        <div className="course-description">
          <h2>Mô tả khóa học</h2>
          <div className="description-content">
            {course.description.split('\n').map((paragraph, index) => (
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
                  <th>Ngày bắt đầu - kết thúc</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>                
                {classes.map((classItem) => (
                  <tr key={classItem.classCode}>
                    <td>{classItem.classCode}</td>
                    <td>{classItem.teacher?.UserProfile?.fullName}</td>
                    <td>{formatSchedule(classItem.schedule)}</td>
                    <td>{`${classItem.startTime} - ${classItem.endTime}`}</td>
                    <td>{classItem.room}</td>
                    <td>{`${classItem.currentStudents}/${classItem.maxStudents}`}</td>
                    <td>{`${formatDate(classItem.startDate.toString())} - ${formatDate(classItem.endDate.toString())}`}</td>
                    <td>
                      <button className="register-button" 
                      onClick={() => handleRegisterClick(classItem.classCode)}>Đăng ký</button>                        
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
    </div>
  )
}

export default CourseDetail