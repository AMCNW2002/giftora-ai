import './AdminPages.css';

const metrics = [
  { label: 'Revenue', value: 'Rs. 1.24M', delta: '+14.8%' },
  { label: 'Conversion', value: '4.8%', delta: '+1.1%' },
  { label: 'AOV', value: 'Rs. 8,640', delta: '+7.3%' },
];

const categoryData = [
  { name: 'Gift Packs', value: 82 },
  { name: 'Luxury Boxes', value: 68 },
  { name: 'Custom Gifts', value: 64 },
  { name: 'Flowers', value: 52 },
  { name: 'Personalized', value: 49 },
];

const topProducts = [
  { name: 'Luxury Hamper Deluxe', sales: '248 orders', revenue: 'Rs. 412,000' },
  { name: 'Rose Premium Set', sales: '192 orders', revenue: 'Rs. 310,000' },
  { name: 'Signature Candle Gift', sales: '177 orders', revenue: 'Rs. 284,000' },
];

function AdminAnalytics() {
  return (
    <div className="admin-page-shell">
      <div className="admin-header-row">
        <div>
          <p className="admin-eyebrow">Insights</p>
          <h1>Analytics</h1>
        </div>
        <button type="button" className="admin-primary-btn">Export Report</button>
      </div>

      <div className="admin-overview-grid">
        {metrics.map((metric) => (
          <div key={metric.label} className="admin-metric">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <em>{metric.delta}</em>
          </div>
        ))}
      </div>

      <div className="admin-grid analytics-grid">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h2>Sales Trend</h2>
            <span>Last 7 days</span>
          </div>
          <div className="analytics-bars">
            {[58, 72, 49, 86, 95, 78, 91].map((value, index) => (
              <div key={index} className="analytics-bar-wrap">
                <div className="analytics-bar" style={{ height: `${value}%` }} />
                <span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-head">
            <h2>Top Categories</h2>
            <span>By sales</span>
          </div>
          <div className="category-list">
            {categoryData.map((category) => (
              <div key={category.name} className="category-row">
                <div className="category-row__meta">
                  <span>{category.name}</span>
                  <small>{category.value}%</small>
                </div>
                <div className="category-row__bar">
                  <i style={{ width: `${category.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2>Best Performing Products</h2>
          <span>Top 3</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.name}>
                  <td>{product.name}</td>
                  <td>{product.sales}</td>
                  <td>{product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
