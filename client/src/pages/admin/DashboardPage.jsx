import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Package, Users, ShoppingBag, TrendingUp, ArrowRight } from 'lucide-react';
import { getOrderStats } from '../../services/orderService';
import { getUserStats } from '../../services/userService';
import { getProducts } from '../../services/productService';
import { formatPrice } from '../../utils/helpers';
import './AdminPages.css';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0,
    pendingOrders: 0, newUsers: 0, monthlyRevenue: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orderStats, userStats, products] = await Promise.all([
          getOrderStats(),
          getUserStats(),
          getProducts({ limit: 1 })
        ]);
        setStats({
          totalRevenue: orderStats.data.totalRevenue,
          totalOrders: orderStats.data.totalOrders,
          pendingOrders: orderStats.data.pendingOrders,
          totalUsers: userStats.data.totalUsers,
          newUsers: userStats.data.newUsers,
          totalProducts: products.data.total,
          monthlyRevenue: orderStats.data.monthlyRevenue
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: <DollarSign size={24} />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { title: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} />, color: '#4f7df9', bg: 'rgba(79,125,249,0.1)' },
    { title: 'Total Users', value: stats.totalUsers, icon: <Users size={24} />, color: '#9333ea', bg: 'rgba(147,51,234,0.1)' },
    { title: 'Products', value: stats.totalProducts, icon: <Package size={24} />, color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  ];

  if (loading) return <div className="page-loader"><div className="loader" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your store overview.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card glass-card">
            <div className="stat-card-icon" style={{ color: card.color, background: card.bg }}>
              {card.icon}
            </div>
            <div className="stat-card-info">
              <p className="stat-card-title">{card.title}</p>
              <h3 className="stat-card-value">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card glass-card">
          <div className="card-header">
            <h3><TrendingUp size={20} /> Quick Stats</h3>
          </div>
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="qs-label">Pending Orders</span>
              <span className="qs-value badge badge-warning">{stats.pendingOrders}</span>
            </div>
            <div className="quick-stat">
              <span className="qs-label">New Users (30 days)</span>
              <span className="qs-value badge badge-info">{stats.newUsers}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card glass-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/admin/products" className="quick-action-btn">
              <Package size={20} /> Manage Products <ArrowRight size={16} />
            </Link>
            <Link to="/admin/orders" className="quick-action-btn">
              <ShoppingBag size={20} /> View Orders <ArrowRight size={16} />
            </Link>
            <Link to="/admin/users" className="quick-action-btn">
              <Users size={20} /> Manage Users <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
