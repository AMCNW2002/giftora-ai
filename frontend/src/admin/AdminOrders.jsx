import { useEffect, useState } from 'react';
import './AdminPages.css';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const fallbackOrders = [
  { id: '#ORD-10048', customer: 'John Perera', item: 'Luxury Gift Box', total: 'Rs. 8,500', status: 'Delivered', date: 'Oct 30, 2026' },
  { id: '#ORD-10047', customer: 'Dilhani Fernando', item: 'Rose Premium Set', total: 'Rs. 12,000', status: 'Processing', date: 'Oct 30, 2026' },
  { id: '#ORD-10046', customer: 'Kasun Silva', item: 'Custom Photo Frame', total: 'Rs. 7,500', status: 'Pending', date: 'Oct 29, 2026' },
  { id: '#ORD-10045', customer: 'Nimesh Jayasuriya', item: 'Signature Candle Gift', total: 'Rs. 5,900', status: 'Shipped', date: 'Oct 28, 2026' },
];

function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(fallbackOrders);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setOrders(fallbackOrders);
      return;
    }

    let active = true;
    setLoading(true);
    api
      .getOrders()
      .then((response) => {
        if (!active) return;
        const mapped = (response || []).map((order) => {
          const firstItem = order.items?.[0];
          return {
            id: `#${String(order.id).slice(0, 8).toUpperCase()}`,
            customer: user.name,
            item: firstItem?.name || 'Gift order',
            total: `Rs. ${Number(order.total || 0).toLocaleString()}`,
            status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Placed',
            date: new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          };
        });
        setOrders(mapped.length ? mapped : fallbackOrders);
      })
      .catch(() => {
        if (!active) return;
        setOrders(fallbackOrders);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <div className="admin-page-shell">
      <div className="admin-header-row">
        <div>
          <p className="admin-eyebrow">Operations</p>
          <h1>Orders</h1>
        </div>
        <button type="button" className="admin-primary-btn">+ New Order</button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-box">
          <span>⌕</span>
          <input type="text" placeholder="Search orders..." />
        </div>
        <select className="admin-select" defaultValue="all">
          <option value="all">All Status</option>
          <option value="delivered">Delivered</option>
          <option value="processing">Processing</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
        </select>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2>Recent Orders</h2>
          <span>{orders.length} Records</span>
        </div>

        {loading && <p className="admin-empty-state">Loading orders...</p>}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Item</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.item}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={`admin-status ${
                      order.status === 'Delivered' ? 'status-success' :
                      order.status === 'Processing' ? 'status-warning' :
                      order.status === 'Shipped' ? 'status-info' : 'status-muted'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
