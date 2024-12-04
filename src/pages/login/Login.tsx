import React from 'react'
import '../../styles/pages/login/Login.css'

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4">Welcome Back</h2>
        <p className="text-center text-muted">Sign in to your account</p>
        <form>
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
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? {' '}
          <a href="/register" className="signup-link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login