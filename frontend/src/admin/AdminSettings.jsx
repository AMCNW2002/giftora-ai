import './AdminPages.css';

const sections = [
  { name: 'Storefront', value: 'Live', tone: 'status-success' },
  { name: 'Checkout', value: 'Enabled', tone: 'status-success' },
  { name: 'Auto replies', value: 'On', tone: 'status-info' },
  { name: 'Maintenance', value: 'Off', tone: 'status-muted' },
];

const settings = [
  { label: 'Enable AI recommendations', enabled: true },
  { label: 'Require order confirmation', enabled: true },
  { label: 'Send festive email campaigns', enabled: false },
  { label: 'Auto-archive completed messages', enabled: true },
];

function AdminSettings() {
  return (
    <div className="admin-page-shell">
      <div className="admin-header-row">
        <div>
          <p className="admin-eyebrow">Control Center</p>
          <h1>Settings</h1>
        </div>
        <button type="button" className="admin-primary-btn">Save Changes</button>
      </div>

      <div className="admin-grid settings-grid">
        {sections.map((section) => (
          <div key={section.name} className="admin-card settings-card">
            <div className="settings-card__head">
              <span>{section.name}</span>
              <span className={`admin-status ${section.tone}`}>{section.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel settings-panel">
        <div className="admin-panel-head">
          <h2>Store Preferences</h2>
          <span>System defaults</span>
        </div>

        <div className="settings-list">
          {settings.map((setting) => (
            <div key={setting.label} className="setting-row">
              <span>{setting.label}</span>
              <button type="button" className={`toggle ${setting.enabled ? 'toggle-on' : ''}`}>
                <span />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
