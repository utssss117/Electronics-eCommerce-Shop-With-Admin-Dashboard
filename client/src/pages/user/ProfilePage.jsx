import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/authService';
import './UserPages.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', password: '' });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const updateData = { name: form.name, email: form.email, phone: form.phone };
      if (form.password) updateData.password = form.password;
      const { data } = await updateProfile(updateData);
      updateUser(data);
      setMessage('Profile updated successfully!');
      setForm(prev => ({ ...prev, password: '' }));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page">
      <div className="container">
        <h1 className="page-title">My Profile</h1>
        <div className="profile-card glass-card">
          <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <h2>{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          <span className={`badge badge-${user?.role === 'admin' ? 'primary' : 'info'}`}>{user?.role}</span>
        </div>
        <div className="profile-form glass-card">
          <h3>Update Profile</h3>
          {message && <div className="profile-message">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group"><label>Name</label>
                <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="input-group"><label>Email</label>
                <input className="input-field" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="input-group"><label>Phone</label>
                <input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="input-group"><label>New Password (optional)</label>
                <input className="input-field" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Leave blank to keep current" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
