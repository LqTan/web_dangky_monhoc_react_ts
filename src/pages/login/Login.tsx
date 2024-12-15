import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/apis/AuthAPI'
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/login/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

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
        <h2 className="text-center mb-4">Chào mừng trở lại</h2>
        <p className="text-center text-muted">Đăng nhập vào tài khoản của bạn</p>
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
        <p className="text-center mt-3">
          Chưa có tài khoản?{' '}
          <a href="/register" className="signup-link">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;