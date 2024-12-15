import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, DrupalRegisterRequest } from '../../services/apis/AuthAPI'
import '../../styles/pages/register/Register.css'

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    pass: '',
    confirmPassword: '',
    field_fullname: '',
    field_identification_code: '',
    field_phone_number: '',
    field_user_career: 2, // Mặc định là 2
    field_workplace: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.pass !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    try {
      const registerData: DrupalRegisterRequest = {
        name: formData.name,
        mail: formData.mail,
        pass: formData.pass,
        field_fullname: formData.field_fullname,
        field_identification_code: formData.field_identification_code,
        field_phone_number: formData.field_phone_number,
        field_user_career: formData.field_user_career,
        field_workplace: formData.field_workplace
      }

      await register(registerData)
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
            <label>Tên đăng nhập</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                name="mail"
                className="form-control"
                value={formData.mail}
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
                name="field_fullname"
                className="form-control"
                value={formData.field_fullname}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
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
                name="field_identification_code"
                className="form-control"
                value={formData.field_identification_code}
                onChange={handleChange}
                placeholder="Nhập CMND/CCCD"
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
                name="field_phone_number"
                className="form-control"
                value={formData.field_phone_number}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
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
                name="field_workplace"
                className="form-control"
                value={formData.field_workplace}
                onChange={handleChange}
                placeholder="Nhập nơi làm việc"
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
                name="pass"
                className="form-control"
                value={formData.pass}
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