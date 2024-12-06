import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/apis/AuthAPI'
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/login/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(email, password);
      authLogin(response.token, response.user);
      navigate('/');
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Email hoặc mật khẩu không chính xác');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4">Welcome Back</h2>
        <p className="text-center text-muted">Sign in to your account</p>
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
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
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account?{' '}
          <a href="/register" className="signup-link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;