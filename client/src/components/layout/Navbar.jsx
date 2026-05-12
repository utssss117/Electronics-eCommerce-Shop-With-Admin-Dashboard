import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, LayoutDashboard, ChevronDown, Heart, Smartphone, Laptop, Headphones, Camera, Gamepad2, Watch, Tv, Keyboard, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const categoryLinks = [
  { name: 'Smartphones', icon: <Smartphone size={16} />, path: '/products?category=Smartphones' },
  { name: 'Laptops', icon: <Laptop size={16} />, path: '/products?category=Laptops' },
  { name: 'Audio', icon: <Headphones size={16} />, path: '/products?category=Audio' },
  { name: 'Cameras', icon: <Camera size={16} />, path: '/products?category=Cameras' },
  { name: 'Gaming', icon: <Gamepad2 size={16} />, path: '/products?category=Gaming' },
  { name: 'Wearables', icon: <Watch size={16} />, path: '/products?category=Wearables' },
  { name: 'Tablets', icon: <Tv size={16} />, path: '/products?category=Tablets' },
  { name: 'Accessories', icon: <Keyboard size={16} />, path: '/products?category=Accessories' },
];

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Tier 1: Utility Bar */}
      <div className="navbar-utility">
        <div className="container utility-container">
          <div className="utility-links">
            <Link to="/orders"><Package size={12} /> Track Your Order</Link>
            <Link to="/contact"><Headphones size={12} /> Contact Us</Link>
            <Link to="/stores"><MapPin size={12} /> Store Locator</Link>
          </div>
        </div>
      </div>

      {/* Tier 2: Main Bar */}
      <div className="navbar-main">
        <div className="navbar-container container">
          <Link to="/" className="navbar-brand">
            <img src="/images/logo.svg" alt="ElectroShop Logo" className="brand-logo-img" />
            <span className="brand-text">
              Electro<span className="brand-accent">Shop</span>
            </span>
          </Link>

          <form className="search-form" onSubmit={handleSearch}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search Products & Brands"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>

          <div className="navbar-right">
            <Link to="/cart" className="nav-action-btn" title="Cart">
              <ShoppingCart size={20} />
              <span className="nav-action-label">Cart</span>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="user-menu-wrapper">
                <button
                  className="nav-action-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User size={20} />
                  <span className="nav-action-label">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={12} className={`chevron ${userMenuOpen ? 'open' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <User size={15} /> Profile
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <Package size={15} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="nav-action-btn">
                  <User size={20} />
                  <span className="nav-action-label">Login</span>
                </Link>
              </div>
            )}

            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Strip */}
      <div className="navbar-categories">
        <div className="container">
          <div className="category-strip">
            {categoryLinks.map(cat => (
              <Link
                key={cat.name}
                to={cat.path}
                className="cat-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="mobile-cats">
            {categoryLinks.map(cat => (
              <Link key={cat.name} to={cat.path} className="mobile-cat-link" onClick={() => setMobileMenuOpen(false)}>
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
          {!isAuthenticated && (
            <div className="mobile-auth">
              <Link to="/login" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      {(userMenuOpen || mobileMenuOpen) && (
        <div className="menu-overlay" onClick={() => { setUserMenuOpen(false); setMobileMenuOpen(false); }} />
      )}
    </nav>
  );
};

export default Navbar;
