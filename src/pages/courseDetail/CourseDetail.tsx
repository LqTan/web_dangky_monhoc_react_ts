import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../styles/pages/courseDetail/CourseDetail.css'
import ConfirmationModal from '../../modal/ConfirmationModal'
import SuccessModal from '../../modal/SuccessModal'
import { Course, fetchCourseByCode } from '../../services/apis/courseAPI'
import { fetchCourseCategories } from '../../services/apis/courseCategoryAPI'
import { Class, fetchClasses } from '../../services/apis/classAPI'
import { useAuth } from '../../context/AuthContext'
import { checkCourseRegistration, registerClass } from '../../services/apis/classRegistrationAPI'

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
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        if (!id) return;
        setIsLoading(true);
        
        // Tải thông tin khóa học
        const courseData = await fetchCourseByCode(id);        
        setCourse(courseData);

        // Tải danh sách lớp học
        const classesData = await fetchClasses();
        console.log(classesData)
        // Lọc lớp học theo khóa học
        const filteredClasses = classesData.filter((cls: Class) => cls.field_course_code === id);
        setClasses(filteredClasses);

        // Tải danh sách danh mục để lấy tên danh mục
        const categories = await fetchCourseCategories();        
        const category = categories.find((cat: any) => 
          cat.tid === courseData.training_program_tid
        );
        if (category) {          
          setCategoryName(category.name);
        }

        // Kiểm tra đăng ký nếu user đã đăng nhập
        if (user) {
          const isRegistered = await checkCourseRegistration(user.id, id);                  
          setIsAlreadyRegistered(isRegistered);
        }

      } catch (error) {
        console.error('Failed to load course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [id, user]);

  const handleRegisterClick = (classCode: string) => {
    setSelectedClass(classCode)
    setShowConfirmModal(true)
  }

  const handleConFirmRegistation = async () => {
    try {
      if (!user) {
        alert('Bạn cần đăng nhập để đăng ký lớp học');
        navigate('/login');
        return;
      }
  
      // const result = await registerClass(selectedClass);
      // console.log('Đăng ký thành công:', result);
      setShowConfirmModal(false);

      // Chuyển hướng đến trang thanh toán với thông tin lớp học
      const selectedClassInfo = classes.find(c => c.title === selectedClass);
      navigate('/payment-confirmation', { 
        state: { 
          classInfo: selectedClassInfo,
          courseInfo: course
        } 
      });
      // setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Lỗi đăng ký:', error);
      alert(error.message || 'Đăng ký lớp học thất bại!');
      // Nếu lỗi 403 hoặc lỗi token, chuyển về trang đăng nhập
      if (error.message.includes('không có quyền') || error.message.includes('đăng nhập')) {
        navigate('/login');
      }
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

  const formatSchedule = (weekdays: string[]) => {
    return weekdays.map(day => `Thứ ${day === '8' ? 'CN' : day}`).join(', ');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    return imagePath.replace('public://', 'http://course-management.lndo.site/sites/default/files/');
  }

  return (
    <div className="course-detail-container">
      <div className="course-hero">
        <img src={getImageUrl(course.field_course_thumbnail)} alt={course.title} />
      </div>

      <div className="course-detail-content">
        <div className="course-header">
          <h1>{course.title}</h1>
          <div className="course-meta">
            <div className="duration">
              <i className="bi bi-code-slash"></i>
              <span>{course.field_course_code}</span>
            </div>
            <div className="course-category">
              <i className="bi bi-folder"></i>
              <span>{categoryName}</span>
            </div>
            <div className="price">
              <i className="bi bi-currency-exchange"></i>              
              <span className="original">{parseFloat(course.field_course_tuition_fee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
          </div>
        </div>

        <div className="course-description">
          <h2>Mô tả khóa học</h2>
          <div className="description-content"
            dangerouslySetInnerHTML={{ __html: course.field_course_description }}>
            {/* {course.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))} */}
          </div>
        </div>

        <div className="course-classes">
        <h2>Lớp học đang mở</h2>
        {isLoading ? (
          <div className="loading">Đang tải...</div>
        ) : isAlreadyRegistered ? (
          <div className="registered-message">
            <p>Bạn đã đăng ký khóa học này. Vui lòng kiểm tra lịch học tại mục "Lịch học của tôi".</p>
            <button 
              className="view-schedule-button" 
              onClick={() => navigate('/student-info')}
            >
              Xem lịch học
            </button>
          </div>
        ) : classes.length > 0 ? (
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
                  <tr key={classItem.title}>
                    <td>{classItem.title}</td>
                    <td>{classItem.field_teacher_fullname}</td>
                    <td>{formatSchedule(classItem.field_class_weekdays)}</td>
                    <td>{`${classItem.field_class_start_time} - ${classItem.field_class_end_time}`}</td>
                    <td>{classItem.field_room}</td>
                    <td>{`${classItem.field_current_num_of_participant}/${classItem.field_max_num_of_participant}`}</td>
                    <td>{`${formatDate(classItem.field_class_open_date)} - ${formatDate(classItem.field_class_end_date)}`}</td>
                    <td>
                      <button 
                        className="register-button" 
                        onClick={() => handleRegisterClick(classItem.title)}
                      >
                        Đăng ký
                      </button>                        
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-classes-message">
            <p>Hiện tại không có lớp học nào được mở cho khóa học này.</p>
          </div>
        )}
      </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Đăng ký khóa học"
        message="Bạn có chắc chắn muốn đăng ký khóa học này?"
        className={selectedClass}
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