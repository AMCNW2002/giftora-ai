import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, PackageSearch, X } from 'lucide-react';
import { products, categories } from '../../data/products';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { CategoryPills } from '../../components/CategoryPills/CategoryPills';
import { Button } from '../../components/Button/Button';
import { useDebounce } from '../../hooks/useDebounce';
import './Shop.css';

export function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const categoryParam = searchParams.get('category');
  const selectedCategory = categories.some((category) => category.id === categoryParam)
    ? categoryParam
    : 'all';

  // Debounce search query by 250ms
  const debouncedSearch = useDebounce(searchQuery, 250);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category filter
        const matchCategory =
          selectedCategory === 'all' || item.category === selectedCategory;

        // Search query filter (matches name, description, category)
        const query = debouncedSearch.trim().toLowerCase();
        const matchSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);

        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return a.price - b.price;
        }
        if (sortBy === 'price-high') {
          return b.price - a.price;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        // Default: featured (Bestsellers first, then id)
        if (a.tag === 'Bestseller' && b.tag !== 'Bestseller') return -1;
        if (b.tag === 'Bestseller' && a.tag !== 'Bestseller') return 1;
        return a.id - b.id;
      });
  }, [debouncedSearch, selectedCategory, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchParams({});
    setSortBy('featured');
  };

  return (
    <div className="giftora-shop">
      {/* Header Banner */}
      <section className="giftora-shop__hero">
        <div className="app-container giftora-shop__hero-inner">
          <div className="section-eyebrow">Explore Our Catalog</div>
          <h1>Curated Personalized Gifts</h1>
          <p>
            Explore handcrafted keepsakes, fresh floral botanicals, heirloom jewelry, and artisan
            treats.
          </p>
        </div>
      </section>

      {/* Filter & Controls Toolbar */}
      <section className="giftora-shop__toolbar-section">
        <div className="app-container">
          <div className="giftora-shop__toolbar">
            {/* Search Input */}
            <div className="giftora-shop__search-wrap">
              <Search size={18} className="giftora-shop__search-icon" />
              <input
                type="text"
                className="giftora-shop__search-input"
                placeholder="Search gifts, flowers, jewelry, chocolate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="giftora-shop__search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="giftora-shop__sort-wrap">
              <SlidersHorizontal size={16} className="giftora-shop__sort-icon" />
              <label htmlFor="shop-sort" className="giftora-shop__sort-label">
                Sort:
              </label>
              <select
                id="shop-sort"
                className="giftora-shop__sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured Curations</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated (Highest First)</option>
              </select>
            </div>
             <span className="giftora-shop__count-badge">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'gift' : 'gifts'}
            </span>
          </div>

          {/* Category Pills Row */}
          <div className="giftora-shop__pills-row">
            <CategoryPills
              categories={categories}
              activeCategory={selectedCategory}
              onSelect={(category) =>
                setSearchParams(category === 'all' ? {} : { category })
              }
            />
           
          </div>
        </div>
      </section>

      {/* Products Grid or Empty State */}
      <section className="giftora-shop__catalog-section">
        <div className="app-container">
          {filteredProducts.length > 0 ? (
            <div className="giftora-shop__grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="giftora-shop__empty">
              <div className="giftora-shop__empty-icon">
                <PackageSearch size={44} />
              </div>
              <h3>No Gifts Found</h3>
              <p>
                We couldn't find any gifts matching your criteria. Try adjusting your search or
                category filters.
              </p>
              <Button variant="primary" size="md" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Shop;
