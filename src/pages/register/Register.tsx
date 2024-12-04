import React from 'react'
import '../../styles/pages/register/Register.css'

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="text-center mb-4">Create Account</h2>
        <p className="text-center text-muted">Sign up for your account</p>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-shield-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm your password"
              />
            </div>
          </div>
          <button type="submit" className="register-button">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? {' '}
          <a href="#" className="login-link">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register