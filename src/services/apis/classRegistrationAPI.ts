import axios from 'axios';

const BASE_URL = 'http://course-management.lndo.site/api';

// Thêm interface cho analytics data
export interface AnalyticsData {
  class_code: string;
  class_name: string;
  course_code: string;
  course_name: string;
  amount: number;
  currency: string;
  payment_method: string;
  student_id: string;
  student_name: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  registration_id?: string;
  transaction_id?: string;
  message?: string;
}

interface PaymentResponse {
  payment_url: string;
  analytics_data: {
    classes: Array<{
      class_id: string;
      class_code: string;
      class_name: string;
      course_code: string;
      course_name: string;
      amount: string;
    }>;
    total_amount: number;
    currency: string;
    payment_method: string;
    student_id: string;
    student_name: string;
  };
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
  changed: string;
  field_academic_year: string;
}

export interface ClassRegistration {
  title: string;
  field_registration_user: string;
  field_registration_status: "pending" | "confirmed";
  field_course_code?: string;
}

// Thêm interface cho response VNPay
interface VNPayResponse {
  status: string;
  code: string;
  message: string;
  data: {
    vnp_ResponseCode: string;
    vnp_TransactionStatus: string;
    payment_date: string;
    total_amount: number;
    transactions: Array<{
      transaction_id: string;
      class_code: string;
      class_name: string;
      amount: number;
      receipt_id: string;
    }>;
    student_name: string;
    receipt_id: string;
  };
}

// Thêm hàm verify payment
export const verifyVNPayPayment = async (queryString: string): Promise<VNPayResponse> => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Không tìm thấy thông tin xác thực');
    }

    const response = await axios.get<VNPayResponse>(
      `${BASE_URL}/payment/vnpay-return?${queryString}`,
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi xác thực thanh toán VNPay:', error);
    throw error;
  }
};

export const processPayment = async (
  classCodes: string[], 
  paymentMethod: 'vnpay' | 'paypal', 
  paypalTransactionId?: string,
  returnUrl?: string
) => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Không tìm thấy thông tin xác thực');
    }

    const payload = {
      class_codes: classCodes,
      payment_method: paymentMethod,
      ...(paypalTransactionId && { payment_transaction_id: paypalTransactionId }),
      ...(returnUrl && { return_url: returnUrl }) // Thêm returnUrl vào payload
    };

    const response = await axios.post<PaymentResponse>(
      `${BASE_URL}/course-register-register-course-api`,
      payload,
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi xử lý thanh toán:', error);
    throw error;
  }
};

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

export const registerClass = async (classId: string, userInfo?: any) => {
  try {
    const basicAuth = localStorage.getItem('auth');
    const requestBody = basicAuth 
      ? { class_id: classId }
      : {
          class_id: classId,
          user_info: userInfo
        };

    const response = await axios.post(
      `${BASE_URL}/v1/class-registration`,
      requestBody,
      {
        headers: basicAuth ? {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Lỗi đăng ký lớp học:', error);
    throw error;
  }
};

// API lấy danh sách lớp học đã đăng ký
export const fetchRegisteredClasses = async (userId: string) => {
  try {
    const response = await axios.get<ClassRegistration[]>(
      `${BASE_URL}/class-registrations/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi lấy danh sách đăng ký:', error);
    throw error;
  }
};

// API đăng ký khóa học với VNPAY
export const registerWithVNPay = async (classCodes: string[]) => {
  try {
    const response = await axios.post(`${BASE_URL}/course-register-register-course-api`, {
      class_codes: classCodes,
      payment_method: "vnpay"
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi thanh toán VNPay:', error);
    throw error;
  }
};

// API đăng ký khóa học với PayPal
export const registerWithPayPal = async (classCode: string, paypalTransactionId: string): Promise<PaymentResponse> => {
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
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Lỗi đăng ký PayPal:', error);
    throw error;
  }
};

export const verifyPaymentStatus = async (paymentMethod: string, transactionId: string) => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Vui lòng đăng nhập lại');
    }
    const response = await axios.post<PaymentVerificationResponse>(
      `${BASE_URL}/verify-payment`,
     {
       payment_method: paymentMethod,
       transaction_id: transactionId
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
    console.error('Lỗi verify payment:', error);
    throw error;
  }
}