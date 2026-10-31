import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles, LogOut, Gift, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, login, register, logout } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegisterMode && !name.trim())) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setSubmitting(true);
    try {
      // The backend checks everything and saves the new user in MongoDB
      const authUser = isRegisterMode
        ? await register({ name: name.trim(), email: email.trim().toLowerCase(), password })
        : await login({ email: email.trim().toLowerCase(), password });

      setStatusMessage({
        type: 'success',
        text: isRegisterMode
          ? `Welcome to Giftora AI, ${authUser.name}!`
          : `Signed in successfully as ${authUser.name}`
      });
      setTimeout(() => {
        navigate(location.state?.from || '/', { replace: true });
      }, 800);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
    setName('');
    setStatusMessage({ type: 'success', text: 'You have been signed out safely.' });
  };

  // If user is already logged in
  if (currentUser) {
    return (
      <div className="giftora-login app-container">
        <div className="giftora-login__card giftora-login__card--profile">
          <div className="giftora-login__avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="section-eyebrow">
            <Sparkles size={14} /> Member Profile
          </div>
          <h2>Welcome back, {currentUser.name}!</h2>
          <p className="giftora-login__email">{currentUser.email}</p>
          <span className="giftora-login__badge">
            Member since {currentUser.memberSince || 'Recently'}
          </span>

          <div className="giftora-login__profile-perks">
            <div className="giftora-login__perk-item">
              <Gift size={18} color="var(--primary)" />
              <div>
                <strong>Saved Gift Boxes</strong>
                <span>Your custom boxes are saved to your account</span>
              </div>
            </div>
            <div className="giftora-login__perk-item">
              <CheckCircle size={18} color="var(--accent)" />
              <div>
                <strong>Complimentary Express Shipping</strong>
                <span>Unlocked on your orders over Rs. 80</span>
              </div>
            </div>
          </div>

          <div className="giftora-login__actions">
            <Link to="/gift-box">
              <Button variant="primary" size="md" icon={<Gift size={16} />}>
                Go to Gift Box Builder
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              onClick={handleLogout}
              icon={<LogOut size={16} />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Login / Register Form
  return (
    <div className="giftora-login app-container">
      <div className="giftora-login__card">
        {/* Brand header */}
        <div className="giftora-login__header">
          <div className="giftora-login__icon-wrap">
            <Sparkles size={22} />
          </div>
          <h2>{isRegisterMode ? 'Join Giftora AI' : 'Welcome to Giftora AI'}</h2>
          <p>
            {isRegisterMode
              ? 'Create a complimentary account to save custom gift boxes and receive AI recommendations.'
              : 'Sign in to access your saved boxes, orders, and curated wishlist.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="giftora-login__tabs">
          <button
            type="button"
            className={`giftora-login__tab ${!isRegisterMode ? 'giftora-login__tab--active' : ''}`}
            onClick={() => {
              setIsRegisterMode(false);
              setStatusMessage(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`giftora-login__tab ${isRegisterMode ? 'giftora-login__tab--active' : ''}`}
            onClick={() => {
              setIsRegisterMode(true);
              setStatusMessage(null);
            }}
          >
            Create Account
          </button>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div className={`giftora-login__alert giftora-login__alert--${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="giftora-login__form">
          {isRegisterMode && (
            <div className="giftora-login__field">
              <label htmlFor="auth-name">Your Full Name</label>
              <div className="giftora-login__input-wrap">
                <User size={18} className="giftora-login__input-icon" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegisterMode}
                />
              </div>
            </div>
          )}

          <div className="giftora-login__field">
            <label htmlFor="auth-email">Email Address</label>
            <div className="giftora-login__input-wrap">
              <Mail size={18} className="giftora-login__input-icon" />
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="giftora-login__field">
            <label htmlFor="auth-pass">Password</label>
            <div className="giftora-login__input-wrap">
              <Lock size={18} className="giftora-login__input-icon" />
              <input
                id="auth-pass"
                type="password"
                placeholder={isRegisterMode ? 'At least 8 characters, letters + numbers' : '••••••••'}
                minLength={isRegisterMode ? 8 : undefined}
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="giftora-login__submit-btn"
            icon={<ArrowRight size={18} />}
          >
            {submitting ? 'Please wait…' : isRegisterMode ? 'Create Complimentary Account' : 'Sign In to Giftora'}
          </Button>
        </form>

        {/* Footer Toggle Link */}
        <div className="giftora-login__footer">
          {isRegisterMode ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="giftora-login__switch-btn"
                onClick={() => setIsRegisterMode(false)}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Giftora AI?{' '}
              <button
                type="button"
                className="giftora-login__switch-btn"
                onClick={() => setIsRegisterMode(true)}
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
