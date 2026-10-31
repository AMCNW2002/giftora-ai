import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductsContext';
import { Button } from '../Button/Button';
import './ProtectedRoute.css';

/**
 * Wrap routes with this to make them "registered users only".
 *  - not signed in  -> redirected to /login
 *  - signed in      -> waits until the catalogue is loaded, then shows the page
 * (The backend ALSO refuses every request without a valid token - this is only the nice UI part.)
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const { status, error, retry } = useProducts();
  const location = useLocation();

  if (loading) {
    return <div className="giftora-gate">Checking your session…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (status === 'error') {
    return (
      <div className="giftora-gate">
        <p>{error || 'Could not load gifts.'}</p>
        <Button variant="primary" onClick={retry}>Try again</Button>
      </div>
    );
  }
  if (status !== 'ready') {
    return <div className="giftora-gate">Loading gifts…</div>;
  }
  return <Outlet />;
}

export default ProtectedRoute;
