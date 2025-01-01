import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registerClass } from '../../services/apis/classRegistrationAPI';
import '../../styles/pages/registerClassForm/RegisterClassForm.css';
import SuccessModal from '../../modal/SuccessModal';

interface RegisterFormData {
  username: string;
  email: string;
  fullname: string;
  phone: string;
  identification_code: string;
  workplace: string;
}

const RegisterClassForm = () => {
  const { classId } = useParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    fullname: '',
    phone: '',
    identification_code: '',
    workplace: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerClass(classId!, formData);
      // Hien thi modal thanh cong
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Có lỗi xảy ra khi đăng ký');
    }
  };

  // Xử lý khi đóng modal thành công
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Quay về trang chủ hoặc trang danh sách khóa học
    navigate('/');
  };

  return (
    <div className="register-form-container">
      <div className="register-form-wrapper">
        <h2>Đăng ký lớp học</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập <span className="required">*</span></label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập địa chỉ email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullname">Họ và tên <span className="required">*</span></label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="form-group">
            <label htmlFor="identification_code">CMND/CCCD <span className="required">*</span></label>
            <input
              type="text"
              id="identification_code"
              name="identification_code"
              value={formData.identification_code}
              onChange={handleChange}
              required
              placeholder="Nhập số CMND/CCCD"
            />
          </div>

          <div className="form-group">
            <label htmlFor="workplace">Nơi làm việc <span className="required">*</span></label>
            <input
              type="text"
              id="workplace"
              name="workplace"
              value={formData.workplace}
              onChange={handleChange}
              required
              placeholder="Nhập nơi làm việc"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Hủy
            </button>
            <button type="submit" className="submit-button">
              Đăng ký
            </button>
          </div>
        </form>
      </div>
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
    </div>
  );
};

export default RegisterClassForm;