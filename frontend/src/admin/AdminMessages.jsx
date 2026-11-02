import './AdminPages.css';

const messages = [
  { sender: 'Nimali', preview: 'The custom gift box is ready for review.', time: '2 min ago', status: 'Unread' },
  { sender: 'Gift Support', preview: 'Customer requested a return for a luxury hamper.', time: '18 min ago', status: 'Action' },
  { sender: 'Marketing Team', preview: 'Campaign copy for wedding gift bundles approved.', time: '1 hour ago', status: 'Read' },
  { sender: 'Ops Team', preview: 'Stock alert: candle gift sets are below threshold.', time: '2 hours ago', status: 'Priority' },
];

function AdminMessages() {
  return (
    <div className="admin-page-shell">
      <div className="admin-header-row">
        <div>
          <p className="admin-eyebrow">Customer Care</p>
          <h1>Messages</h1>
        </div>
        <button type="button" className="admin-primary-btn">+ Compose</button>
      </div>

      <div className="admin-overview-grid">
        <div className="admin-metric">
          <span>Inbox</span>
          <strong>1,482</strong>
          <em>+64 new</em>
        </div>
        <div className="admin-metric">
          <span>Unread</span>
          <strong>216</strong>
          <em>7 urgent</em>
        </div>
        <div className="admin-metric">
          <span>Templates</span>
          <strong>36</strong>
          <em>7 auto replies</em>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2>Recent Threads</h2>
          <span>4 active</span>
        </div>

        <div className="message-thread-list">
          {messages.map((message) => (
            <div key={`${message.sender}-${message.time}`} className="message-thread">
              <div className="message-thread__avatar">{message.sender.charAt(0)}</div>
              <div className="message-thread__content">
                <div className="message-thread__row">
                  <strong>{message.sender}</strong>
                  <small>{message.time}</small>
                </div>
                <p>{message.preview}</p>
              </div>
              <span className={`admin-status ${
                message.status === 'Unread' ? 'status-warning' :
                message.status === 'Action' ? 'status-info' :
                message.status === 'Priority' ? 'status-muted' : 'status-success'
              }`}>
                {message.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminMessages;
