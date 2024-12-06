import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../services/apis/AuthAPI'
import '../../styles/pages/register/Register.css'

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    profile: {
      fullName: '',
      gender: '',
      occupation: '',
      workplace: '',
      phoneNumber: '',
      citizenId: ''
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes('profile.')) {
      const profileField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        role: 'student', // Mặc định role là student
        profile: formData.profile
      })
      navigate('/login')
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau')
      }
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="text-center mb-4">Tạo tài khoản mới</h2>
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Họ và tên</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                name="profile.fullName"
                className="form-control"
                value={formData.profile.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Giới tính</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-gender-ambiguous"></i>
              </span>
              <input
                type="text"
                name="profile.gender"
                className="form-control"
                value={formData.profile.gender}
                onChange={handleChange}
                placeholder="Nhập giới tính"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nghề nghiệp</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-briefcase"></i>
              </span>
              <input
                type="text"
                name="profile.occupation"
                className="form-control"
                value={formData.profile.occupation}
                onChange={handleChange}
                placeholder="Nhập nghề nghiệp"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nơi làm việc</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-building"></i>
              </span>
              <input
                type="text"
                name="profile.workplace"
                className="form-control"
                value={formData.profile.workplace}
                onChange={handleChange}
                placeholder="Nhập nơi làm việc"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-telephone"></i>
              </span>
              <input
                type="text"
                name="profile.phoneNumber"
                className="form-control"
                value={formData.profile.phoneNumber}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>CMND/CCCD</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-card-text"></i>
              </span>
              <input
                type="text"
                name="profile.citizenId"
                className="form-control"
                value={formData.profile.citizenId}
                onChange={handleChange}
                placeholder="Nhập CMND/CCCD"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-shield-lock"></i>
              </span>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>
          </div>

          <button type="submit" className="register-button">
            Đăng ký
          </button>
        </form>
        <p className="text-center mt-3">
          Đã có tài khoản?{' '}
          <a href="/login" className="login-link">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register