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
  const [isRegistering, setIsRegistering] = useState(false)

  if (!isOpen && !showSuccessModal) return null

  const handleConfirm = async () => {
    if (!className) return;

    try {
      setIsRegistering(true)
      if (!user) {
        navigate(`/register-class/${className}`);
        onCancel();
        return;
      }

      await registerClass(className);
      setShowSuccessModal(true); // Hiện success modal trước
      onCancel(); // Sau đó đóng confirmation modal
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Có lỗi xảy ra khi đăng ký');
      onCancel();
    } finally {
      setIsRegistering(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/'); // Quay về trang chủ
  }

  return (
    <>
      {isOpen && (
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
              <button 
                className="cancel-button" 
                onClick={onCancel}
                disabled={isRegistering}
              >
                Hủy
              </button>
              <button 
                className="confirm-button" 
                onClick={handleConfirm}
                disabled={isRegistering}
              >
                {isRegistering ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
    </>
  )
}

export default ConfirmationModal