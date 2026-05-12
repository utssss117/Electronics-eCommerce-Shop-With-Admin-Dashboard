import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import './AdminPages.css';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      const params = { limit: 50 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await getAllOrders(params);
      setOrders(data.orders);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Error updating status');
    }
  };

  if (loading) return <div className="page-loader"><div className="loader" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div><h1>Orders</h1><p>{orders.length} orders</p></div>
      </div>

      <div className="admin-toolbar">
        <div className="filter-chips">
          <button className={`filter-chip ${!statusFilter ? 'active' : ''}`} onClick={() => setStatusFilter('')}>All</button>
          {statuses.map(s => (
            <button key={s} className={`filter-chip ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap glass-card">
        <table className="admin-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="order-id-cell">#{order._id.slice(-8)}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>{order.orderItems?.length} items</td>
                <td className="table-price">{formatPrice(order.totalPrice)}</td>
                <td><span className={`badge badge-${getStatusColor(order.status)}`}>{order.status}</span></td>
                <td className="table-date">{formatDate(order.createdAt)}</td>
                <td>
                  <select className="input-field status-select" value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}>
                    {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="empty-state"><h3>No orders found</h3></div>}
      </div>
    </div>
  );
};

export default ManageOrdersPage;
