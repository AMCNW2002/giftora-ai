import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  return (
    <article className="giftora-card">
      <Link to={`/product/${product.id}`} className="giftora-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="giftora-card__image"
          loading="lazy"
        />

        {/* Tag Badge */}
        {product.tag && (
          <span
            className={`giftora-card__badge ${
              product.tag === 'Bestseller'
                ? 'giftora-card__badge--bestseller'
                : 'giftora-card__badge--new'
            }`}
          >
            {product.tag}
          </span>
        )}

        {/* Quick Add Overlay Button */}
        <button
          type="button"
          className={`giftora-card__quick-add ${
            justAdded ? 'giftora-card__quick-add--added' : ''
          }`}
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          title="Quick add to bag"
        >
          {justAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
          <span>{justAdded ? 'Added' : 'Quick Add'}</span>
        </button>
      </Link>

      <div className="giftora-card__body">
        {/* Category & Rating */}
        <div className="giftora-card__meta">
          <span className="giftora-card__category">{product.category}</span>
          <div className="giftora-card__rating">
            <Star size={14} className="giftora-card__star-icon" />
            <span>{Number(product.rating).toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="giftora-card__title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Description snippet */}
        <p className="giftora-card__desc">{product.description}</p>

        {/* Price & Action */}
        <div className="giftora-card__footer">
          <div className="giftora-card__price">
            <span className="giftora-card__currency">$</span>
            <span className="giftora-card__amount">{Number(product.price).toFixed(2)}</span>
          </div>

          <button
            type="button"
            className={`giftora-card__btn ${justAdded ? 'giftora-card__btn--added' : ''}`}
            onClick={handleAddToCart}
          >
            {justAdded ? (
              <>
                <Check size={15} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={15} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
