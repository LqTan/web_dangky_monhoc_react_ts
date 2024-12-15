import axios from 'axios';

const BASE_URL = 'http://course-management.lndo.site';
const API_URL = 'http://course-management.lndo.site/api/user-info-api';
const AVATAR_URL = 'http://course-management.lndo.site/api/user-info-api';

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  fullname: string;
  identification_code: string;
  phone_number: string;
  workplace: string;
  avatar: string | null;
  career?: {
    tid: string;
    name: string;
  };
}

const getCsrfToken = async (): Promise<string> => {
  const response = await axios.get('http://course-management.lndo.site/session/token');
  return response.data;
};

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  const basicAuth = localStorage.getItem('auth');
  if (!basicAuth) {
    throw new Error('Chưa đăng nhập');
  }

  const response = await axios.get(`${API_URL}/${uid}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuth}`
    }
  });

  // Thêm base URL vào đường dẫn avatar nếu có
  if (response.data.avatar && !response.data.avatar.startsWith('http')) {
    response.data.avatar = `${BASE_URL}${response.data.avatar}`;
  }
  
  return response.data;
};

interface UpdateProfileData {
  fullname?: string;
  phone_number?: string;
  workplace?: string;
  career?: {
    tid: string;
  };
}

export const updateUserProfile = async (uid: string, data: UpdateProfileData): Promise<UserProfile> => {
  const basicAuth = localStorage.getItem('auth');
  if (!basicAuth) {
    throw new Error('Chưa đăng nhập');
  }

  const csrfToken = await getCsrfToken();

  const response = await axios.patch(`${API_URL}/${uid}`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuth}`,
      'X-CSRF-Token': csrfToken
    }
  });
  return response.data;
};

export const uploadAvatar = async (uid: string, file: File): Promise<{ avatar_url: string }> => {
  const basicAuth = localStorage.getItem('auth');
  if (!basicAuth) {
    throw new Error('Chưa đăng nhập');
  }

  const csrfToken = await getCsrfToken();

  const formData = new FormData();
  formData.append('avatar', file);

  const response = await axios.post(`${AVATAR_URL}/${uid}/avatar`, formData, {
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'X-CSRF-Token': csrfToken
    }
  });
  return response.data;
};