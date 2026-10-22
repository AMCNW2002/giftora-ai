import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import './NotFound.css';

export function NotFound() {
  return (
    <div className="giftora-not-found app-container">
      <div className="giftora-not-found__card">
        <div className="giftora-not-found__badge">
          <Sparkles size={16} /> 404 Error
        </div>
        <h1 className="giftora-not-found__title">Page Not Found</h1>
        <p className="giftora-not-found__text">
          Oops! The gift or page you are looking for seems to have wandered off our curated shelves.
          Let's help you discover something special.
        </p>

        <div className="giftora-not-found__actions">
          <Link to="/">
            <Button variant="primary" size="lg" icon={<Home size={18} />}>
              Return to Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" size="lg" icon={<ShoppingBag size={18} />}>
              Explore Gift Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
