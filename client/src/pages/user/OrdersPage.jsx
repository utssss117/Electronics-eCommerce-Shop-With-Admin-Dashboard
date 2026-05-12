import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { getMyOrders } from '../../services/orderService';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import './UserPages.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="user-page"><div className="container"><div className="page-loader"><div className="loader" /></div></div></div>;

  return (
    <div className="user-page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h3>No orders yet</h3>
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card glass-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">#{order._id.slice(-8)}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`badge badge-${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <div className="order-items-preview">
                  {order.orderItems.map((item, i) => (
                    <span key={i} className="order-item-tag">{item.name} x{item.quantity}</span>
                  ))}
                </div>
                <div className="order-footer">
                  <span className="order-total">{formatPrice(order.totalPrice)}</span>
                  <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
