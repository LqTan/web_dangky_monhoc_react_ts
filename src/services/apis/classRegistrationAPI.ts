import axios from 'axios';

const BASE_URL = 'http://course-management.lndo.site/api';

interface PaymentResponse {
  payment_url?: string;
  message?: string;
  data?: {
    registration_id: string;
    transaction_id: string;
    payment_method: string;
    class_code: string;
    class_name: string;
    registered_at?: string;
  }
}

export interface RegisteredClassInfo {
  title: string;
  field_class_code: string;
  field_class_start_time: string;
  field_class_end_time: string;
  field_class_open_date: string;
  field_class_end_date: string;
  field_class_weekdays: string[];
  field_current_num_of_participant: number;
  field_max_num_of_participant: string;
  field_room: string;
  field_teacher_fullname: string;
  field_course_code: string;
}

// API kiểm tra đăng ký khóa học
export const checkCourseRegistration = async (uid: string, courseCode: string) => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    const registeredClasses = await fetchRegisteredClasses(uid);      
    return registeredClasses.some(cls => cls.field_course_code === courseCode);
  } catch (error) {
    console.error('Lỗi kiểm tra đăng ký khóa học:', error);
    throw error;
  }
};

// API lấy danh sách lớp học đã đăng ký
export const fetchRegisteredClasses = async (uid: string) => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    const response = await axios.get<RegisteredClassInfo[]>(
      `${BASE_URL}/classes-registered/${uid}`,
      {
        headers: {
          // 'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Lỗi lấy danh sách lớp học:', error);
    throw error;
  }
};

// API đăng ký khóa học với VNPAY
export const registerWithVNPay = async (classCode: string) => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    const response = await axios.post<PaymentResponse>(
      `${BASE_URL}/course-register-register-course-api`,
      {
        class_code: classCode,
        payment_method: 'vnpay'
      },
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Lỗi đăng ký VNPAY:', error);
    throw error;
  }
};

// API đăng ký khóa học với PayPal
export const registerWithPayPal = async (classCode: string, paypalTransactionId: string) => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    const response = await axios.post<PaymentResponse>(
      `${BASE_URL}/course-register-register-course-api`,
      {
        class_code: classCode,
        payment_method: 'paypal',
        payment_transaction_id: paypalTransactionId
      },
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Lỗi đăng ký PayPal:', error);
    throw error;
  }
};