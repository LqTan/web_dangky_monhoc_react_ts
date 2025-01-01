import axios from 'axios';

const API_URL = 'http://course-management.lndo.site/api/user-exams';
const BASE_URL = 'http://course-management.lndo.site/api';

export interface ExamInfo {
  title: string;
  field_date_exam: string;
  field_end_exam: string;
  field_start_exam: string;
  field_exam_location: string;
  field_class_code: string;
  field_course_code: string;
}

export interface Exam {
  nid: string;
  title: string;
  field_exam_date: string;
  field_exam_description: string | false;
  field_exam_end_time: string;
  field_exam_fee: string;
  field_exam_location: string;
  field_exam_start_time: string;
  field_exam_status: string;
}

interface UserInfo {
  fullname: string;
  birthday: string;
  gender: 'male' | 'female';
  identification: string;
  permanent_address: string;
  temporary_address: string;
  phone: string;
  email: string;
}

interface ExamRegistrationRequest {
  exam_id: string;
  user_info: UserInfo;
}

interface ExamRegistrationResponse {
  message: string;
  registration_id: string;
  payment_url: string;
}

export interface ExamRegistration {
  nid: string;
  title: string;
  field_participant_fullname: string;
  field_registration_exam_status: string;
}

export const fetchUserExamRegistrations = async (userId: string): Promise<ExamRegistration[]> => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Không tìm thấy thông tin xác thực');
    }

    const response = await axios.get<ExamRegistration[]>(
      `${BASE_URL}/exam-registrations/${userId}`,
      {
        headers: {
          // 'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải danh sách đăng ký thi:', error);
    throw error;
  }
};

export const registerExam = async (data: ExamRegistrationRequest): Promise<ExamRegistrationResponse> => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Không tìm thấy thông tin xác thực');
    }

    const response = await axios.post<ExamRegistrationResponse>(
      `${BASE_URL}/v1/exam-registration`,
      data,
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi đăng ký kỳ thi:', error);
    throw error;
  }
};

// export const fetchExams = async () => {
//   try {
//     const response = await axios.get<ExamInfo[]>(API_URL);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching exams:', error);
//     throw error;
//   }
// };
export const fetchExams = async (): Promise<Exam[]> => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Không tìm thấy thông tin xác thực');
    }

    const response = await axios.get<Exam[]>(`${BASE_URL}/exam-schedules`, {
      headers: {
        // 'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải danh sách kỳ thi:', error);
    throw error;
  }
};