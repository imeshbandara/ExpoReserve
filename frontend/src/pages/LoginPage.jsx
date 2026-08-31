import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { 
  Terminal, 
  LogIn, 
  AlertCircle,
} from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorParam = searchParams.get('error');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Sync url errors
  useEffect(() => {
    if (errorParam) {
      if (errorParam === 'auth_failed') {
        setError('Authentication failed. Please try again.');
      } else if (errorParam === 'session_expired') {
        setError('Your session has expired. Please sign in again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  }, [errorParam]);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/auth/login');
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to get authorization URL.');
      }
    } catch (err) {
      setError('Authentication service is currently unavailable.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-bg-orb login-bg-orb--1" />
      <div className="login-bg-orb login-bg-orb--2" />
      <div className="login-bg-orb login-bg-orb--3" />

      <div className="login-card" style={{ padding: '40px' }}>
        {/* Logo / brand */}
        <div className="login-logo" style={{ marginBottom: '30px' }}>
          <div className="login-logo-icon">
            <Terminal size={24} color="white" strokeWidth={2.5} />
          </div>
          <div className="login-logo-text">
            <h1>ExpoReserve</h1>
            <span>Secure Stall Reservation Platform</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--clr-text)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.95rem', marginTop: '8px' }}>
            Sign in to access your dashboard and manage stall reservations.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="login-error animate-fade-in" role="alert" style={{ marginBottom: '20px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button 
          type="button" 
          className="btn btn--primary login-submit-btn" 
          disabled={loading}
          onClick={handleLogin}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
        >
          {loading ? (
            <div className="spinner spinner--sm" />
          ) : (
            <>
              <LogIn size={18} />
              <span>Continue with Single Sign-On (SSO)</span>
            </>
          )}
        </button>

        <p className="login-footer" style={{ marginTop: '30px' }}>
          By signing in, you agree to our{' '}
          <Link to="/terms">Terms of Service</Link> and{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
