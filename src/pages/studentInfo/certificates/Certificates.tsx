import React from 'react'
import '../../../styles/pages/studentInfo/certificates/Certificates.css'

const Certificates = () => {
  const certificates = [
    {
      title: 'Chứng chỉ Tin học văn phòng',
      issueDate: '20/1/2024',
      grade: 'Khá',
    },
    {
      title: 'Chứng chỉ Tiếng Anh B1',
      issueDate: '15/2/2024',
      grade: 'Giỏi',
    }
  ]

  return (
    <div className="profile-card">
      <h2 className="certificates-title">Chứng chỉ</h2>
      <div className="certificates-grid">
        {certificates.map((cert, index) => (
          <div key={index} className="certificate-card">
            <h3 className="certificate-name">{cert.title}</h3>
            <div className="certificate-info">
              <div className="info-item">
                <span className="label">Ngày cấp: </span>
                <span className="value">{cert.issueDate}</span>
              </div>
              <div className="info-item">
                <span className="label">Xếp loại: </span>
                <span className="value">{cert.grade}</span>
              </div>
            </div>
            <div className="certificate-actions">
              <button className="action-button">
                <i className="bi bi-eye"></i> XEM
              </button>
              <button className="action-button">
                <i className="bi bi-download"></i> TẢI XUỐNG
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Certificates