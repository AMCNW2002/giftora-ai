import './AdminPages.css';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';

const fallbackProducts = [
  { name: 'Luxury Gift Box', category: 'Gift Packs', stock: 24, price: 2400, status: 'In Stock' },
  { name: 'Rose Premium Set', category: 'Flowers', stock: 18, price: 1900, status: 'Low Stock' },
  { name: 'Custom Photo Frame', category: 'Custom Gifts', stock: 31, price: 2800, status: 'In Stock' },
  { name: 'Signature Candle Gift', category: 'Personalized Gifts', stock: 9, price: 1450, status: 'Low Stock' },
  { name: 'Luxury Hamper Deluxe', category: 'Luxury Boxes', stock: 14, price: 3500, status: 'In Stock' },
];

function AdminProducts() {
  const { user } = useAuth();
  const { products, status } = useProducts();
  const liveProducts = products.length ? products : fallbackProducts;

  if (!user) {
    return (
      <div className="admin-page-shell">
        <div className="admin-header-row">
          <div>
            <p className="admin-eyebrow">Inventory</p>
            <h1>Products</h1>
          </div>
        </div>
        <div className="admin-panel">
          <p className="admin-empty-state">Sign in to load the live product catalogue from the backend.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-shell">
      <div className="admin-header-row">
        <div>
          <p className="admin-eyebrow">Inventory</p>
          <h1>Products</h1>
        </div>
        <button type="button" className="admin-primary-btn">+ Add Product</button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-box">
          <span>⌕</span>
          <input type="text" placeholder="Search products..." />
        </div>
        <select className="admin-select" defaultValue="all">
          <option value="all">All Categories</option>
          <option value="gift-packs">Gift Packs</option>
          <option value="flowers">Flowers</option>
          <option value="custom-gifts">Custom Gifts</option>
        </select>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2>Product List</h2>
          <span>{liveProducts.length} Items</span>
        </div>

        {status === 'loading' && <p className="admin-empty-state">Loading product catalogue...</p>}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {liveProducts.map((product) => (
                <tr key={product.id ?? product.name}>
                  <td className="product-name-cell">{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.stock ?? 24}</td>
                  <td>Rs. {Number(product.price ?? 0).toLocaleString()}</td>
                  <td>
                    <span className={`admin-status ${product.status === 'In Stock' || Number(product.stock ?? 0) > 10 ? 'status-success' : 'status-warning'}`}>
                      {product.status ?? (Number(product.stock ?? 0) > 10 ? 'In Stock' : 'Low Stock')}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="admin-link-btn">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
