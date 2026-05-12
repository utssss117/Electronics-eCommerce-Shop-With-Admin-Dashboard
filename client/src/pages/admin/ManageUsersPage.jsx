import { useState, useEffect } from 'react';
import { Trash2, Shield } from 'lucide-react';
import { getUsers, updateUserRole, deleteUser } from '../../services/userService';
import { formatDate } from '../../utils/helpers';
import './AdminPages.css';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers({ limit: 50 });
      setUsers(data.users);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, { role: newRole });
      fetchUsers();
    } catch (error) {
      alert('Error updating role');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (loading) return <div className="page-loader"><div className="loader" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div><h1>Users</h1><p>{users.length} users total</p></div>
      </div>

      <div className="admin-table-wrap glass-card">
        <table className="admin-table">
          <thead>
            <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="table-user">
                    <div className="table-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className="table-email">{user.email}</td>
                <td>
                  <span className={`badge badge-${user.role === 'admin' ? 'primary' : 'info'}`}>
                    {user.role === 'admin' && <Shield size={12} />} {user.role}
                  </span>
                </td>
                <td className="table-date">{formatDate(user.createdAt)}</td>
                <td>
                  <div className="table-actions">
                    <select className="input-field role-select" value={user.role}
                      onChange={e => handleRoleChange(user._id, e.target.value)}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)}
                      disabled={user.role === 'admin'}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage;
