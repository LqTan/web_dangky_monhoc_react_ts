import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRegisteredClasses, ClassRegistration } from '../../../services/apis/classRegistrationAPI';
import { fetchClasses, Class } from '../../../services/apis/classAPI';
import { fetchCourseByCode, Course } from '../../../services/apis/courseAPI';
import '../../../styles/pages/studentInfo/courseHistory/CourseHistory.css';

interface CourseHistoryItem {
  registrationTitle: string;
  courseId: string;
  courseName: string;
  classCode: string;
  status: string;
  fee: string;
  classInfo: Class;
  courseInfo: Course;
}

const CourseHistory = () => {
  // Tạo các biến để lưu trữ dữ liệu:
  // - courseHistory: danh sách các khóa học đã đăng ký
  // - loading: trạng thái đang tải dữ liệu
  // - error: thông báo lỗi nếu có
  const [courseHistory, setCourseHistory] = useState<CourseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // navigate dùng để chuyển trang.
  const navigate = useNavigate();

  // useEffect sẽ chạy khi trang web được tải lần đầu
  useEffect(() => {
    // Hàm này dùng để tải dữ liệu lịch sử đăng ký khóa học
    const loadData = async () => {
      try {
        // Lấy ID của người dùng đã đăng nhập từ bộ nhớ trình duyệt 
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        if (!userId) {
          throw new Error('Không tìm thấy thông tin người dùng');
        }

        // Gọi API để lấy:
        // 1. Danh sách các lớp đã đăng ký
        // 2. Thông tin chi tiết của tất cả các lớp học.
        const registrations = await fetchRegisteredClasses(userId);                
        const classes = await fetchClasses();
        
        // Xử lý từng đăng ký một để lấy thông tin đầy đủ
        const historyItems = await Promise.all(
          registrations.map(async (reg) => {
            // Lấy mã lớp từ title đăng ký
            const classCode = reg.title.split(' - ')[1];
            
            // Tìm thông tin lớp học tương ứng
            const classInfo = classes.find(c => c.title === classCode);
            
            if (!classInfo) {
              throw new Error(`Không tìm thấy thông tin lớp ${classCode}`);
            }

            // Lấy thông tin khóa học từ mã khóa học
            const course = await fetchCourseByCode(classInfo.field_course_code);

            // Tạo đối tượng chứa đầy đủ thông tin cho mỗi đăng ký
            return {
              registrationTitle: reg.title,
              courseId: classInfo.field_course_code,
              courseName: course.title,
              classCode: classInfo.title,
              status: reg.field_registration_status,
              fee: course.field_course_tuition_fee,
              classInfo: classInfo,
              courseInfo: course
            };
          })
        );

        // Lưu danh sách đã xử lý vào biến courseHistory
        setCourseHistory(historyItems);
      } catch (err: any) {
        console.error(err);
        setError('Không thể tải lịch sử đăng ký. Vui lòng thử lại sau.');
      } finally {
        // Kết thúc trạng thái loading
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Hàm xử lý khi người dùng nhấn nút thanh toán
  const handlePayment = (items: CourseHistoryItem[]) => {
    const unpaidItems = items.filter(item => item.status === 'pending');
    if (unpaidItems.length === 0) {
      alert('Không có lớp học nào cần thanh toán');
      return;
    }

    // Chuyển đến trang thanh toán và gửi theo thông tin các lớp học cần thanh toán
    navigate('/payment-confirmation', {
      state: {
        registrations: unpaidItems.map(item => ({
          classInfo: item.classInfo,
          courseInfo: item.courseInfo
        }))
      }
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'confirmed':
        return 'confirmed';
      case 'cancelled':
        return 'cancelled';
      default:
        return '';
    }
  };

  if (loading) return <div className="profile-card">Đang tải...</div>;
  if (error) return <div className="profile-card error-message">{error}</div>;

  // Lọc ra các đăng ký cần thanh toán
  const pendingRegistrations = courseHistory.filter(item => item.status === 'pending');

  return (
    <div className="profile-card">
      <div className="history-header">
        <h2 className="history-title">Lịch sử đăng ký khóa học</h2>
        {pendingRegistrations.length > 0 && (
          <button 
            className="payment-button"
            onClick={() => handlePayment(courseHistory)}
          >
            Thanh toán ({pendingRegistrations.length} lớp)
          </button>
        )}
      </div>

      {courseHistory.length === 0 ? (
        <div className="empty-message">Chưa có khóa học nào được đăng ký</div>
      ) : (
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Mã khóa học</th>
                <th>Tên khóa học</th>
                <th>Mã lớp</th>
                <th>Học phí</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {courseHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.courseId}</td>
                  <td>{item.courseName}</td>
                  <td>{item.classCode}</td>
                  <td>{new Intl.NumberFormat('vi-VN').format(parseInt(item.fee))} đ</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseHistory;