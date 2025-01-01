import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://course-management.lndo.site',
  withCredentials: true  // Quan trọng! Cho phép gửi và nhận cookie
});

export default axiosInstance;