import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Certificate, fetchCertificates } from '../../../services/apis/certificateAPI';
import '../../../styles/pages/studentInfo/certificates/Certificates.css';

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handlePreview = (fileUrl: string) => {
    const fullUrl = `http://course-management.lndo.site${fileUrl}`;
    window.open(fullUrl, '_blank');
  };

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        if (!userId) {
          throw new Error('Không tìm thấy thông tin người dùng');
        }

        const data = await fetchCertificates(userId);
        setCertificates(data);
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 403) {
          navigate('/login');
        } else {
          setError('Không thể tải danh sách chứng chỉ. Vui lòng thử lại sau.');
        }
        console.error(err);
        setLoading(false);
      }
    };

    loadCertificates();
  }, [navigate]);

  if (loading) return <div className="profile-card">Đang tải...</div>;
  if (error) return <div className="profile-card error-message">{error}</div>;

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
                <span className="value">{formatDate(cert.field_issue_date)}</span>
              </div>
              <div className="info-item">
                <span className="label">Xếp loại: </span>
                <span className="value">{cert.field_rating_name}</span>
              </div>
            </div>
            <div className="certificate-actions">
              <button 
                onClick={() => handlePreview(cert.field_certificate_file_1)}
                className="action-button"
              >
                <i className="bi bi-eye"></i> XEM
              </button>
              <a 
                href={`http://course-management.lndo.site${cert.field_certificate_file_1}`} 
                download 
                className="action-button"
              >
                <i className="bi bi-download"></i> TẢI XUỐNG
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;