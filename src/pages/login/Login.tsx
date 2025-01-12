import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/apis/AuthAPI'
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/login/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(username, password);
      console.log(response);
      authLogin(response.user);
      navigate('/');
    } catch (error: any) {
      if (error.response?.status === 400 || error.response?.status === 403) {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Chào mừng trở lại</h2>
        <p className="login-subtitle">Đăng nhập tài khoản của bạn</p>
        
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="username">Tên tài khoản</label>
            <div className="input-icon-wrapper">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                className="login-form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên tài khoản"
                required
              />
            </div>
          </div>
  
          <div className="login-form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-icon-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="login-form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
              <i 
                className={`password-toggle-icon fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
          </div>
  
          <button type="submit" className="login-button">
            <span>Đăng nhập</span>
            <i className="fas fa-sign-in-alt ms-2"></i>
          </button>
        </form>
  
        <p className="signup-text">
          Bạn chưa có tài khoản?{' '}
          <a href="/register" className="signup-link">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;