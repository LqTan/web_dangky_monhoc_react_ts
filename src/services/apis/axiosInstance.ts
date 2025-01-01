import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://course-management.lndo.site'
});

instance.interceptors.request.use(async (config) => {
  // Lấy CSRF token từ localStorage nếu user đã đăng nhập
  const csrfToken = localStorage.getItem('csrfToken');
  
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  } else {
    // Nếu chưa có token, lấy token cho anonymous user
    try {
      const response = await axios.get('/session/token');
      config.headers['X-CSRF-Token'] = response.data;
    } catch (error) {
      console.error('Không thể lấy CSRF token:', error);
    }
  }
  
  return config;
});

export default instance;