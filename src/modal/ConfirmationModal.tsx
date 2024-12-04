import React from 'react'
import '../styles/modal/ConfirmationModal.css'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }: ConfirmationModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title}</h3>
          <div className="header-line"></div>
        </div>
        <div className="modal-content">
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button className="cancel-button" onClick={onCancel}>
            Hủy
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal