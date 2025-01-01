import axios from 'axios';

const BASE_URL = 'http://course-management.lndo.site/api';

interface ExamPaymentRequest {
  registration_ids: number[];
  payment_method: 'vnpay';
}

interface ExamPaymentResponse {
  payment_url: string;
  analytics_data: {
    exams: Array<{
      exam_id: string;
      exam_name: string;
      exam_date: string;
      amount: string;
      registration_date: string;
      participant_info: {
        fullname: string;
        email: string;
        phone: string;
        birthday: string;
        gender: string;
        identification: string;
        permanent_address: string;
        temporary_address: string;
      };
    }>;
    total_amount: number;
    currency: string;
    payment_method: string;
    student_id: string;
    student_name: string;
  };
}

interface ExamPaymentVerifyResponse {
  status: string;
  message: string;
  data: {
    receipt_id: string;
    receipt_number: string;
    amount: number;
    transaction_id: string;
    payment_date: string;
    receipt_url: string;
  };
}

export const processExamPayment = async (registrationIds: number[]): Promise<ExamPaymentResponse> => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Không tìm thấy thông tin xác thực');
    }

    const payload: ExamPaymentRequest = {
      registration_ids: registrationIds,
      payment_method: 'vnpay'
    };

    const response = await axios.post<ExamPaymentResponse>(
      `${BASE_URL}/v1/exam-payment`,
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