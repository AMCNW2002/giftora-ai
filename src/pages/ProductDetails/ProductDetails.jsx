import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Gift,
  Check,
  Truck,
  ShieldCheck,
  Package,
  Sparkles,
  Plus,
  Minus
} from 'lucide-react';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/Button/Button';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import './ProductDetails.css';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [justAdded, setJustAdded] = useState(false);

  // Find product by id
  const product = products.find((p) => p.id === Number(id));

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQty(1);
    setActiveTab('description');
  }, [id]);

  if (!product) {
    return (
      <div className="giftora-product-not-found app-container">
        <h2>Gift Not Found</h2>
        <p>The requested gift curation could not be located in our catalog.</p>
        <Link to="/shop">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  // Related products
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="giftora-details app-container">
      {/* Back Navigation */}
      <div className="giftora-details__nav">
        <button
          type="button"
          className="giftora-details__back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back to gifts
        </button>
        <div className="giftora-details__breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="giftora-details__main-grid">
        {/* Left Column: Image */}
        <div className="giftora-details__image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="giftora-details__image"
          />
          {product.tag && (
            <span
              className={`giftora-details__badge ${
                product.tag === 'Bestseller'
                  ? 'giftora-details__badge--bestseller'
                  : 'giftora-details__badge--new'
              }`}
            >
              {product.tag}
            </span>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="giftora-details__info">
          <span className="giftora-details__category">{product.category}</span>
          <h1 className="giftora-details__title">{product.name}</h1>

          {/* Rating & Reviews */}
          <div className="giftora-details__rating-row">
            <div className="giftora-details__stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(product.rating) ? '#F4A261' : '#e0e0e0'}
                  color="#F4A261"
                />
              ))}
            </div>
            <span className="giftora-details__rating-val">{Number(product.rating).toFixed(1)}</span>
            <span className="giftora-details__review-count">(124 verified reviews)</span>
          </div>

          {/* Price */}
          <div className="giftora-details__price-row">
            <span className="giftora-details__price">${Number(product.price).toFixed(2)}</span>
            <span className="giftora-details__tax-note">Taxes included • Gift box eligible</span>
          </div>

          {/* Short Description */}
          <p className="giftora-details__summary">{product.description}</p>

          {/* Quantity & Cart Actions */}
          <div className="giftora-details__actions-box">
            <div className="giftora-details__qty-selector">
              <span className="giftora-details__qty-label">Quantity:</span>
              <div className="giftora-details__qty-controls">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  disabled={qty <= 1}
                >
                  <Minus size={15} />
                </button>
                <span className="giftora-details__qty-num">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((prev) => prev + 1)}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="giftora-details__buttons">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                icon={justAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
                className="giftora-details__add-btn"
              >
                {justAdded ? 'Added to Bag!' : `Add to Bag • $${(product.price * qty).toFixed(2)}`}
              </Button>

              <Link to="/gift-box">
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Gift size={18} />}
                  className="giftora-details__box-btn"
                >
                  Personalize in Gift Box
                </Button>
              </Link>
            </div>
          </div>

          {/* Perks Row */}
          <div className="giftora-details__perks">
            <div className="giftora-details__perk">
              <Truck size={18} color="var(--primary)" />
              <div>
                <strong>Complimentary Express Shipping</strong>
                <span>Eligible on orders over $80</span>
              </div>
            </div>
            <div className="giftora-details__perk">
              <Package size={18} color="var(--accent)" />
              <div>
                <strong>Artisan Luxury Packaging</strong>
                <span>Signature gift wrap & wax-sealed card</span>
              </div>
            </div>
            <div className="giftora-details__perk">
              <ShieldCheck size={18} color="var(--secondary)" />
              <div>
                <strong>100% Delight Guarantee</strong>
                <span>Hassle-free 30-day replacements</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Switchable Tabs Section */}
      <div className="giftora-details__tabs-section">
        <div className="giftora-details__tab-headers" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'description'}
            className={`giftora-details__tab-btn ${
              activeTab === 'description' ? 'giftora-details__tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'details'}
            className={`giftora-details__tab-btn ${
              activeTab === 'details' ? 'giftora-details__tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('details')}
          >
            Product Details & Sizing
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'shipping'}
            className={`giftora-details__tab-btn ${
              activeTab === 'shipping' ? 'giftora-details__tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Packaging
          </button>
        </div>

        <div className="giftora-details__tab-content">
          {activeTab === 'description' && (
            <div className="giftora-details__tab-pane animate-fade-up">
              <h3>Artisan Story & Craftsmanship</h3>
              <p>
                Each {product.name} is thoughtfully sourced and hand-finished by our master curating
                partners. Designed to evoke genuine wonder and joy, this piece blends timeless
                elegance with modern sentiment.
              </p>
              <p>
                Whether sent directly to a recipient’s door or included in our bespoke AI-curated gift
                boxes, it represents a meaningful gesture of appreciation and love.
              </p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="giftora-details__tab-pane animate-fade-up">
              <h3>Specifications & Materials</h3>
              <ul className="giftora-details__specs-list">
                <li>
                  <strong>Category:</strong> {product.category.toUpperCase()}
                </li>
                <li>
                  <strong>Origin:</strong> Handcrafted in small boutique batches
                </li>
                <li>
                  <strong>Materials:</strong> Premium eco-conscious finishes and non-toxic dyes
                </li>
                <li>
                  <strong>Personalization:</strong> Complimentary embossed gift note card included
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="giftora-details__tab-pane animate-fade-up">
              <h3>Delivery Times & Packaging Guarantee</h3>
              <p>
                Standard courier delivery takes 2 to 4 business days. Priority next-day delivery is
                available at checkout. Orders over $80 receive automatic free express dispatch.
              </p>
              <p>
                All gifts are encased in protective biodegradable cushioning and enclosed in our
                signature rose-blush rigid gift packaging with a satin ribbon and wax seal.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {related.length > 0 && (
        <section className="giftora-details__related">
          <div className="section-eyebrow">
            <Sparkles size={14} /> You May Also Love
          </div>
          <h2>Related Curations</h2>
          <div className="giftora-details__related-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
