import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../styles/pages/courseDetail/CourseDetail.css'
import ConfirmationModal from '../../modal/ConfirmationModal'
import SuccessModal from '../../modal/SuccessModal'
import { Course, fetchCourseByCode } from '../../services/apis/courseAPI'
import { fetchCourseCategories } from '../../services/apis/courseCategoryAPI'
import { Class, fetchClasses } from '../../services/apis/classAPI'
import { useAuth } from '../../context/AuthContext'
import { fetchRegisteredClasses } from '../../services/apis/classRegistrationAPI'

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
  const [isLoading, setIsLoading] = useState(true)
  const [registeredClassForThisCourse, setRegisteredClassForThisCourse] = useState<string | null>(null)

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
        // Lọc lớp học theo khóa học
        const filteredClasses = classesData.filter((cls: Class) => cls.field_course_code === id);
        setClasses(filteredClasses);

        // Tải danh sách danh mục để lấy tên danh mục
        const categories = await fetchCourseCategories();        
        const category = categories.find((cat: any) => cat.tid === courseData.training_program_tid);
        if (category) {          
          setCategoryName(category.name);
        }

        // Kiểm tra đăng ký cho môn học này
        if (user) {
          const registrations = await fetchRegisteredClasses(user.id);
          // Tìm lớp đã đăng ký của môn học này
          const registeredClass = registrations.find(reg => {
            const classCode = reg.title.split(' - ')[1];
            const classInfo = filteredClasses.find(cls => cls.title === classCode);
            return classInfo !== undefined;
          });
          
          if (registeredClass) {
            const classCode = registeredClass.title.split(' - ')[1];
            setRegisteredClassForThisCourse(classCode);
          }
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

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!course) {
    return <div>Không tìm thấy khóa học</div>;
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
          </div>
        </div>

        <div className="course-classes">
          <h2>Lớp học đang mở</h2>
          {isLoading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <div className="classes-table-container">
            {registeredClassForThisCourse && (
              <div className="registered-classes-info">
                <p>
                  <i className="bi bi-info-circle"></i>
                  Bạn đã đăng ký lớp {registeredClassForThisCourse} của khóa học này
                </p>
              </div>
            )}
            
            {classes.length > 0 && !registeredClassForThisCourse ? (
              <table className="classes-table">
                <thead>
                  <tr>
                    <th>Mã lớp</th>
                    <th>Giảng viên</th>
                    <th>Lịch học</th>
                    <th>Thời gian</th>
                    <th>Phòng</th>                  
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
                      <td>{`${formatDate(classItem.field_class_open_date)} - ${formatDate(classItem.field_class_end_date)}`}</td>
                      <td>
                        <button 
                          className="register-button" 
                          onClick={() => handleRegisterClick(classItem.nid)}
                        >
                          Đăng ký
                        </button>                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : !registeredClassForThisCourse ? (
              <div className="no-classes-message">
                <p>Hiện tại không có lớp học nào được mở cho khóa học này.</p>
              </div>
            ) : null}
          </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Đăng ký khóa học"
        message="Bạn có chắc chắn muốn đăng ký khóa học này?"
        className={selectedClass}        
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