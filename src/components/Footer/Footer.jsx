import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Truck, Gift } from 'lucide-react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="giftora-footer" id="about-footer">
      {/* Top Value Ribbon */}
      <div className="giftora-footer__ribbon">
        <div className="app-container giftora-footer__ribbon-inner">
          <div className="giftora-footer__ribbon-item">
            <Truck size={20} />
            <div>
              <strong>Free Express Shipping</strong>
              <span>On all orders over $80</span>
            </div>
          </div>
          <div className="giftora-footer__ribbon-item">
            <Gift size={20} />
            <div>
              <strong>Artisanal Gift Packaging</strong>
              <span>Luxe box, ribbon & wax seal</span>
            </div>
          </div>
          <div className="giftora-footer__ribbon-item">
            <ShieldCheck size={20} />
            <div>
              <strong>100% Delight Guarantee</strong>
              <span>Hand-inspected before dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="app-container giftora-footer__main">
        <div className="giftora-footer__grid">
          {/* Brand Info */}
          <div className="giftora-footer__brand-col">
            <Link to="/" className="giftora-footer__logo">
              <div className="giftora-footer__logo-icon">
                <Sparkles size={18} />
              </div>
              <span>Giftora AI</span>
            </Link>
            <p className="giftora-footer__about-text">
              Transforming the art of gifting through intelligent AI curations. From single heartfelt
              tokens to bespoke gift boxes tailored to any personality and budget.
            </p>
            <div className="giftora-footer__socials">
              <a href="#about-footer" className="giftora-footer__social-btn" aria-label="Instagram">
                <span>IG</span>
              </a>
              <a href="#about-footer" className="giftora-footer__social-btn" aria-label="Pinterest">
                <span>PI</span>
              </a>
              <a href="#about-footer" className="giftora-footer__social-btn" aria-label="Twitter">
                <span>X</span>
              </a>
              <a href="#about-footer" className="giftora-footer__social-btn" aria-label="Facebook">
                <span>FB</span>
              </a>
            </div>
          </div>

          {/* Links Col 1: Shop */}
          <div className="giftora-footer__col">
            <h4 className="giftora-footer__col-title">Shop Gifts</h4>
            <ul className="giftora-footer__links">
              <li><Link to="/shop">All Collections</Link></li>
              <li><Link to="/shop">Personalized Keepsakes</Link></li>
              <li><Link to="/shop">Floral Arrangements</Link></li>
              <li><Link to="/shop">Fine Jewelry</Link></li>
              <li><Link to="/shop">Gourmet Hampers</Link></li>
            </ul>
          </div>

          {/* Links Col 2: Experiences */}
          <div className="giftora-footer__col">
            <h4 className="giftora-footer__col-title">AI Experiences</h4>
            <ul className="giftora-footer__links">
              <li><Link to="/gift-box">Custom Gift Box Builder</Link></li>
              <li><Link to="/shop">Smart Budget Curations</Link></li>
              <li><Link to="/gift-box">Partner & Anniversary Boxes</Link></li>
              <li><Link to="/shop">Executive & Tech Gifts</Link></li>
            </ul>
          </div>

          {/* Links Col 3: Assistance */}
          <div className="giftora-footer__col">
            <h4 className="giftora-footer__col-title">Customer Care</h4>
            <ul className="giftora-footer__links">
              <li><a href="#about-footer">Shipping Policy (Free over $80)</a></li>
              <li><a href="#about-footer">Live Order Tracking</a></li>
              <li><a href="#about-footer">Gift Packaging & Wax Seals</a></li>
              <li><a href="#about-footer">Concierge Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="giftora-footer__bottom">
          <p>© {new Date().getFullYear()} Giftora AI, Inc. Crafted with thoughtful care.</p>
          <div className="giftora-footer__bottom-links">
            <a href="#about-footer">Privacy Policy</a>
            <span>•</span>
            <a href="#about-footer">Terms of Service</a>
            <span>•</span>
            <a href="#about-footer">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
