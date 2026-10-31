import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, UserCheck } from 'lucide-react';
import { Button } from '../Button/Button';
import { useAuth } from '../../context/AuthContext';
import './ProtectedSection.css';

/**
 * ProtectedSection Component
 * Checks if the user is signed in (AuthContext).
 * If not authenticated, displays a friendly sign-in prompt instead of children.
 */
export function ProtectedSection({
  children,
  fallbackTitle = 'Exclusive Member Feature',
  fallbackMessage = 'Please sign in or create a complimentary account to access this section.',
  redirectPath = '/login'
}) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="giftora-protected">
        <div className="giftora-protected__icon-wrap">
          <Lock size={28} />
        </div>
        <h3 className="giftora-protected__title">{fallbackTitle}</h3>
        <p className="giftora-protected__message">{fallbackMessage}</p>
        <Link to={redirectPath}>
          <Button variant="primary" size="md">
            Sign In / Register
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedSection;
