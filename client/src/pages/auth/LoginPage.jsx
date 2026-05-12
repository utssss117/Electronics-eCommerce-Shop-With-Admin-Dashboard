import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirect === 'checkout' ? '/checkout' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-orb auth-orb-1" /><div className="auth-orb auth-orb-2" /></div>
      <div className="auth-card glass-card animate-fadeIn">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Log in to your ElectroShop account</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Enter your password" value={password}
                onChange={e => setPassword(e.target.value)} required />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
        <div className="demo-credentials">
          <p><strong>Demo Accounts:</strong></p>
          <p>Admin: admin@electroshop.com / admin123</p>
          <p>User: john@example.com / user123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
