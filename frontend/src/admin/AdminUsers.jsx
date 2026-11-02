import { useEffect, useState } from 'react';
import './AdminPages.css';
import { useAuth } from '../context/AuthContext';

const fallbackUsers = [
  { name: 'Nimesh Perera', email: 'nimesh@gmail.com', role: 'Customer', status: 'Active', joined: 'Oct 30, 2026' },
  { name: 'Tharushi Silva', email: 'tharushi@gmail.com', role: 'Customer', status: 'Active', joined: 'Oct 29, 2026' },
  { name: 'Sachin Fernando', email: 'sachin@gmail.com', role: 'VIP', status: 'Active', joined: 'Oct 28, 2026' },
  { name: 'Kasun Jayawardena', email: 'kasun@gmail.com', role: 'Customer', status: 'Blocked', joined: 'Oct 27, 2026' },
];

function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState(fallbackUsers);

  useEffect(() => {
    if (!user) {
      setUsers(fallbackUsers);
      return;
    }

    setUsers([
      {
        name: user.name,
        email: user.email,
        role: 'Admin',
        status: 'Active',
        joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
      ...fallbackUsers.slice(0, 3),
    ]);
  }, [user]);

  return (
    <div className="admin-page-shell">
      <div className="admin-header-row">
        <div>
          <p className="admin-eyebrow">Access</p>
          <h1>Users</h1>
        </div>
        <button type="button" className="admin-primary-btn">+ Add User</button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-box">
          <span>⌕</span>
          <input type="text" placeholder="Search users..." />
        </div>
        <select className="admin-select" defaultValue="all">
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="vip">VIP</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2>Recent Users</h2>
          <span>{users.length} Members</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem.email}>
                  <td>{userItem.name}</td>
                  <td>{userItem.email}</td>
                  <td>{userItem.role}</td>
                  <td>
                    <span className={`admin-status ${userItem.status === 'Blocked' ? 'status-muted' : 'status-success'}`}>
                      {userItem.status}
                    </span>
                  </td>
                  <td>{userItem.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
