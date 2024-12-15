import React, { useEffect, useRef, useState } from 'react';
import Header from '../../../components/header/Header';
import Sidebar from '../sidebar/Sidebar';
import '../../../styles/pages/studentInfo/studentProfile/StudentInfo.css';
import CourseHistory from '../courseHistory/CourseHistory';
import ClassSchedule from '../classSchedule/ClassSchedule';
import ExamSchedule from '../examSchedule/ExamSchedule';
import StudyResults from '../studyResults/StudyResults';
import Certificates from '../certificates/Certificates';
import TuitionFees from '../tuitionFees/TuitionFees';
import { UserProfile, getUserProfile, updateUserProfile, uploadAvatar } from '../../../services/apis/userProfileAPI';
import { useNavigate } from 'react-router-dom';

const StudentInfo = () => {
  const [selectedComponent, setSelectedComponent] = useState('Thông tin cá nhân');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value
      });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpdateAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = async () => {
    try {
      if (!editedProfile) return;
  
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
      
      try {
        // Upload avatar nếu có
        if (selectedFile) {
          const avatarResponse = await uploadAvatar(userId, selectedFile);
        }
  
        // Cập nhật thông tin profile
        const updatedProfileResponse = await updateUserProfile(userId, {
          fullname: editedProfile.fullname,
          phone_number: editedProfile.phone_number,
          workplace: editedProfile.workplace,
        });
  
        // Lấy thông tin mới nhất từ server
        const latestProfile = await getUserProfile(userId);        
        
        // Cập nhật state với thông tin mới nhất
        setProfile(latestProfile);
        setEditedProfile(null);
        setIsEditing(false);
        setSelectedFile(null);
  
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/login');
          return;
        }
        throw err;
      }
    } catch (err: any) {
      setError('Không thể cập nhật thông tin người dùng');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        if (!userId) {
          throw new Error('User ID not found');
        }
        const data = await getUserProfile(userId);
        console.log(data);
        setProfile(data);
      } catch (err: any) {
        if (err.message === 'Chưa đăng nhập' || err.response?.status === 403) {
          navigate('/login');
        } else {
          setError('Không thể tải thông tin người dùng');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const renderPersonalInfo = () => {
    if (loading) {
      return <div>Đang tải...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!profile) {
      return <div>Không tìm thấy thông tin người dùng</div>;
    }

    return (
      <div className="profile-card">
        <div className="profile-content">
          <div className="left-section">
            <div className="avatar">
              {selectedFile ? (
                // Hiển thị preview khi đã chọn file mới
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  className="avatar-image"
                />
              ) : profile.avatar ? (
                // Hiển thị avatar hiện tại của user
                <img 
                  src={`${profile.avatar}?${new Date().getTime()}`} // Thêm timestamp để tránh cache
                  alt={profile.fullname || 'Avatar'} 
                  className="avatar-image"
                />
              ) : (
                // Hiển thị placeholder khi không có avatar
                <div className="avatar-placeholder">
                  {profile.fullname?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              accept="image/*"
            />
            <button 
              className="update-button"
              onClick={handleUpdateAvatar}
              disabled={!isEditing}
            >
              Cập Nhật Ảnh
            </button>
          </div>
  
          <div className="right-section">
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  value={isEditing ? editedProfile?.fullname || '' : profile.fullname || ''}
                  onChange={(e) => handleInputChange('fullname', e.target.value)}
                  readOnly={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  value={profile.email || ''}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>
  
            <div className="form-row">
              <div className="form-group">
                <label>Mã định danh</label>
                <input
                  type="text"
                  value={profile.identification_code || ''}
                  readOnly
                  className="readonly"
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={isEditing ? editedProfile?.phone_number || '' : profile.phone_number || ''}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  readOnly={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>
            </div>
  
            <div className="form-row">
              <div className="form-group">
                <label>Nơi làm việc</label>
                <input
                  type="text"
                  value={isEditing ? editedProfile?.workplace || '' : profile.workplace || ''}
                  onChange={(e) => handleInputChange('workplace', e.target.value)}
                  readOnly={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>
              {profile.career && (
                <div className="form-group">
                  <label>Nghề nghiệp</label>
                  <input
                    type="text"
                    value={profile.career.name || ''}
                    readOnly
                    className="readonly"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
  
        <div className="button-container">
          {isEditing ? (
            <>
              <button className="cancel-button" onClick={() => {
                setIsEditing(false);
                setEditedProfile(profile);
                setSelectedFile(null);
              }}>
                Hủy
              </button>
              <button className="save-button" onClick={handleSaveChanges}>
                Lưu Thay Đổi
              </button>
            </>
          ) : (
            <button className="edit-button" onClick={handleEditClick}>
              Chỉnh Sửa
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Thông tin cá nhân':
        return renderPersonalInfo();
      case 'Lịch sử đăng ký':
        return <CourseHistory />;
      case 'Thông tin môn học':
        return <div className="profile-card">Thông tin môn học</div>;
      case 'Lịch học':
        return <ClassSchedule />;
      case 'Lịch thi':
        return <ExamSchedule />;
      case 'Kết quả học tập':
        return <StudyResults />;
      case 'Chứng chỉ':
        return <Certificates />;
      case 'Học phí':
        return <TuitionFees />;
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div>
      <div className="student-info-wrapper">
        <div className="container">
          <div className="student-info-container">
            <Sidebar onSelect={setSelectedComponent} />
            <div className="content">
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;