import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/images/logo.svg" alt="ElectroShop Logo" className="brand-logo-img" />
              <span className="brand-text">Electro<span className="brand-accent">Shop</span></span>
            </Link>
            <p className="footer-desc">
              Good electronics, fair prices, and people who actually care about what they sell.
            </p>
          </div>

          <div className="footer-links">
            <h4>Shop</h4>
            <Link to="/products?category=Smartphones">Smartphones</Link>
            <Link to="/products?category=Laptops">Laptops</Link>
            <Link to="/products?category=Audio">Audio</Link>
            <Link to="/products?category=Gaming">Gaming</Link>
            <Link to="/products?category=Wearables">Wearables</Link>
          </div>

          <div className="footer-links">
            <h4>Account</h4>
            <Link to="/profile">My Profile</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/cart">Shopping Cart</Link>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <div className="contact-item">
              <Mail size={16} />
              <span>support@electroshop.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ElectroShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
