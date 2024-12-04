import React from 'react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Đăng ký thành công</h3>
          <div className="header-line"></div>
        </div>
        <div className="modal-content">
          <p>Bạn đã đăng ký khóa học thành công!</p>
        </div>
        <div className="modal-actions">
          <button className="confirm-button" onClick={onClose}>
            Quay về
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal