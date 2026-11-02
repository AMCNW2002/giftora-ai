import './AdminPages.css';

const templates = [
  { name: 'Anniversary Luxe', mood: 'Romantic', accent: 'Rose Gold', items: 5 },
  { name: 'Corporate Care', mood: 'Professional', accent: 'Minimal', items: 4 },
  { name: 'Birthday Spark', mood: 'Cheerful', accent: 'Festive', items: 6 },
  { name: 'New Baby Joy', mood: 'Warm', accent: 'Soft Pastel', items: 3 },
];

const recommendations = [
  'Add a handwritten note with premium satin wrap.',
  'Include a fragrance candle for a luxury finishing touch.',
  'Suggest a compact personalization card based on the recipient profile.',
];

function AdminGiftBuilder() {
  return (
    <div className="admin-page-shell">
      <div className="admin-header-row">
        <div>
          <p className="admin-eyebrow">AI Tools</p>
          <h1>Gift Builder</h1>
        </div>
        <button type="button" className="admin-primary-btn">+ New Template</button>
      </div>

      <div className="admin-overview-grid">
        <div className="admin-metric">
          <span>Templates</span>
          <strong>128</strong>
          <em>+18 this week</em>
        </div>
        <div className="admin-metric">
          <span>AI Suggestions</span>
          <strong>2.4K</strong>
          <em>+26% conversion</em>
        </div>
        <div className="admin-metric">
          <span>Saved Bundles</span>
          <strong>842</strong>
          <em>Top-rated picks</em>
        </div>
      </div>

      <div className="admin-grid gift-template-grid">
        {templates.map((template) => (
          <article key={template.name} className="admin-card gift-template-card">
            <div className="gift-card-top">
              <span className="mini-badge gift-badge" />
              <button type="button" className="admin-link-btn">Edit</button>
            </div>
            <h3>{template.name}</h3>
            <p>{template.mood} · {template.accent}</p>
            <div className="gift-meta-row">
              <span>{template.items} items</span>
              <span className="admin-status status-success">Live</span>
            </div>
          </article>
        ))}
      </div>

      <div className="admin-panel admin-panel-stack">
        <div className="admin-panel-head">
          <h2>AI Recommendations</h2>
          <span>Smart upsells</span>
        </div>
        <ul className="admin-check-list">
          {recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminGiftBuilder;
