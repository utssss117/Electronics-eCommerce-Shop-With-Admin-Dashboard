import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
    { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src="/images/logo.svg" alt="ElectroShop Logo" className="brand-logo-img" />
          <span>Admin Panel</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="sidebar-link back-link">
          <ArrowLeft size={20} />
          <span>Back to Shop</span>
        </NavLink>
        <button className="sidebar-link logout-link" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
