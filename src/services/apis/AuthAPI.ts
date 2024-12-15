import axios from 'axios';

const API_URL = 'http://course-management.lndo.site';

// Interface cho response đăng nhập từ Drupal
export interface DrupalLoginResponse {
  current_user: {
    uid: string;
    name: string;
  };
  csrf_token: string;
  logout_token: string;
}

// Interface cho request đăng ký
export interface DrupalRegisterRequest {
  name: string;
  mail: string;
  pass: string;
  field_fullname: string;
  field_identification_code: string;
  field_phone_number: string;
  field_user_career: number;
  field_workplace: string;
}

export const register = async (data: DrupalRegisterRequest) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/course-management-authentication-register-api`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    throw error;
  }
};

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/login?_format=json`,
      {
        name: username,
        pass: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    // Lưu credentials để dùng cho các API khác
    const basicAuth = btoa(`${username}:${password}`);
    localStorage.setItem('auth', basicAuth);
    
    return {
      user: {
        id: response.data.current_user.uid,
        name: response.data.current_user.name
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};