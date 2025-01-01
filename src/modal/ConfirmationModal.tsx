import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerClass } from '../services/apis/classRegistrationAPI'
import SuccessModal from './SuccessModal'
import '../styles/modal/ConfirmationModal.css'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  className?: string
  onCancel: () => void
}

const ConfirmationModal = ({ isOpen, title, message, className, onCancel }: ConfirmationModalProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (!className) return;

    try {
      if (!user) {
        // Nếu chưa đăng nhập, chuyển đến form đăng ký
        navigate(`/register-class/${className}`);
        onCancel(); // Đóng modal
        return;
      }

      // Nếu đã đăng nhập, thực hiện đăng ký trực tiếp
      await registerClass(className);
      onCancel(); // Đóng confirmation modal
      setShowSuccessModal(true); // Hiện success modal
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Có lỗi xảy ra khi đăng ký');
      onCancel();
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/'); // Quay về trang chủ
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3>{title}</h3>
            <div className="header-line"></div>
          </div>
          <div className="modal-content">
            <p>{message}</p>
            {className && <p>ID lớp: {className}</p>}
          </div>
          <div className="modal-actions">
            <button className="cancel-button" onClick={onCancel}>
              Hủy
            </button>
            <button className="confirm-button" onClick={handleConfirm}>
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
    </>
  )
}

export default ConfirmationModal