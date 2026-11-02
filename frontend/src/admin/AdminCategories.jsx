import './AdminPages.css';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';

const fallbackCategories = [
  { name: 'Gift Packs', products: 124, status: 'Active' },
  { name: 'Custom Gifts', products: 98, status: 'Active' },
  { name: 'Personalized Gifts', products: 86, status: 'Trending' },
  { name: 'Flowers', products: 74, status: 'Active' },
  { name: 'Luxury Boxes', products: 52, status: 'Draft' },
];

function AdminCategories() {
  const { user } = useAuth();
  const { products, status } = useProducts();

  const categories = products.length
    ? Object.entries(
        products.reduce((acc, product) => {
          const group = (product.category || 'Other').toString();
          acc[group] = (acc[group] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), products: count, status: count > 5 ? 'Trending' : 'Active' }))
    : fallbackCategories;

  if (!user) {
    return (
      <div className="admin-page-shell">
        <div className="admin-header-row">
          <div>
            <p className="admin-eyebrow">Catalog</p>
            <h1>Categories</h1>
          </div>
        </div>
        <div className="admin-panel">
          <p className="admin-empty-state">Sign in to load the live category data from the backend.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-shell">
      <div className="admin-header-row">
        <div>
          <p className="admin-eyebrow">Catalog</p>
          <h1>Categories</h1>
        </div>
        <button type="button" className="admin-primary-btn">+ New Category</button>
      </div>

      <div className="admin-toolbar compact-toolbar">
        <div className="admin-search-box">
          <span>⌕</span>
          <input type="text" placeholder="Search categories..." />
        </div>
      </div>

      {status === 'loading' && <p className="admin-empty-state">Loading categories...</p>}

      <div className="admin-grid categories-grid">
        {categories.map((category) => (
          <div key={category.name} className="admin-card mini-card">
            <div className="mini-card-top">
              <span className="mini-badge" />
              <button type="button" className="admin-link-btn">Edit</button>
            </div>
            <h3>{category.name}</h3>
            <p>{category.products} products</p>
            <span className={`admin-status ${category.status === 'Draft' ? 'status-muted' : category.status === 'Trending' ? 'status-warning' : 'status-success'}`}>
              {category.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategories;
