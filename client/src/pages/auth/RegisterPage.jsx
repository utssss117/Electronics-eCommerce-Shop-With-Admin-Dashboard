import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-orb auth-orb-1" /><div className="auth-orb auth-orb-2" /></div>
      <div className="auth-card glass-card animate-fadeIn">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join ElectroShop today</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-icon-wrap">
              <User size={18} className="input-icon" />
              <input type="text" className="input-field icon-input" placeholder="John Doe"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
            <div className="input-icon-wrap">
              <Mail size={18} className="input-icon" />
              <input type="email" className="input-field icon-input" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <Lock size={18} className="input-icon" />
              <input type={showPassword ? 'text' : 'password'} className="input-field icon-input"
                placeholder="Min 6 characters" value={password}
                onChange={e => setPassword(e.target.value)} required />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-icon-wrap">
              <Lock size={18} className="input-icon" />
              <input type="password" className="input-field icon-input" placeholder="Repeat password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
