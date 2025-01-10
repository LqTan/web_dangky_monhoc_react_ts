import axios from 'axios';

const BASE_URL = 'http://course-management.lndo.site/api/user-info-api';

export const changePassword = async (uid: string, currentPassword: string, newPassword: string) => {
  try {
    const basicAuth = localStorage.getItem('auth');
    if (!basicAuth) {
      throw new Error('Chưa đăng nhập');
    }

    const response = await axios.post(
      `${BASE_URL}/${uid}/change-password`,
      {
        current_password: currentPassword,
        new_password: newPassword
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi thay đổi mật khẩu');
  }
};