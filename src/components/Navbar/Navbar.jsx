import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Sparkles, ShoppingBag, User, Search, Menu, X, Gift } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Monitor scroll for glass shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`giftora-navbar ${isScrolled ? 'giftora-navbar--scrolled' : ''}`}>
      <div className="giftora-navbar__inner app-container">
        {/* Brand Logo */}
        <Link to="/" className="giftora-navbar__brand" aria-label="Giftora AI Home">
          <div className="giftora-navbar__logo-icon">
            <Sparkles size={20} className="giftora-navbar__sparkle" />
          </div>
          <span className="giftora-navbar__logo-text">
            Giftora<span>AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="giftora-navbar__nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `giftora-navbar__link ${isActive ? 'giftora-navbar__link--active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `giftora-navbar__link ${isActive ? 'giftora-navbar__link--active' : ''}`
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/gift-box"
            className={({ isActive }) =>
              `giftora-navbar__link giftora-navbar__link--special ${
                isActive ? 'giftora-navbar__link--active' : ''
              }`
            }
          >
            <Gift size={16} />
            <span>Gift Box</span>
            <span className="giftora-navbar__badge-ai">AI Builder</span>
          </NavLink>
          <a href="#about-footer" className="giftora-navbar__link">
            About
          </a>
        </nav>

        {/* Right Action Icons */}
        <div className="giftora-navbar__actions">
          <Link
            to="/shop"
            className="giftora-navbar__action-btn"
            aria-label="Search Gifts"
            title="Search Catalog"
          >
            <Search size={20} />
          </Link>

          <Link
            to="/login"
            className="giftora-navbar__action-btn"
            aria-label="Account"
            title="User Account"
          >
            <User size={20} />
          </Link>

          <Link
            to="/cart"
            className="giftora-navbar__action-btn giftora-navbar__cart-btn"
            aria-label={`Cart with ${count} items`}
            title="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="giftora-navbar__cart-badge" key={count}>
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="giftora-navbar__mobile-toggle"
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`giftora-navbar__mobile-drawer ${
          isMobileMenuOpen ? 'giftora-navbar__mobile-drawer--open' : ''
        }`}
      >
        <nav className="giftora-navbar__mobile-nav">
          <NavLink to="/" end className="giftora-navbar__mobile-link">
            Home
          </NavLink>
          <NavLink to="/shop" className="giftora-navbar__mobile-link">
            Shop Catalog
          </NavLink>
          <NavLink to="/gift-box" className="giftora-navbar__mobile-link giftora-navbar__mobile-link--highlight">
            <Gift size={18} />
            <span>Build Gift Box (AI)</span>
          </NavLink>
          <NavLink to="/cart" className="giftora-navbar__mobile-link">
            Cart {count > 0 && `(${count})`}
          </NavLink>
          <NavLink to="/login" className="giftora-navbar__mobile-link">
            Account / Sign In
          </NavLink>
          <a href="#about-footer" className="giftora-navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
            About Giftora
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
