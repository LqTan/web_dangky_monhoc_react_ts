import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { changePassword } from '../../../services/apis/userPasswordAPI';
import '../../../styles/pages/studentInfo/changePassword/ChangePassword.css';

const ChangePassword = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      setLoading(true);
      await changePassword(user?.id || '', currentPassword, newPassword);
      setSuccess('Thay đổi mật khẩu thành công');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-card">
      <h2 className="change-password-title">Thay đổi mật khẩu</h2>
      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="change-password-form-group">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="change-password-form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="change-password-form-group">
          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="change-password-error">{error}</div>}
        {success && <div className="change-password-success">{success}</div>}
        <button 
          type="submit" 
          className="change-password-submit"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Thay đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;