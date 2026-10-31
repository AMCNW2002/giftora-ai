import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { Button } from '../../components/Button/Button';
import { formatCurrency } from '../../utils/currency';
import './Cart.css';

export function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, total, shipping, grandTotal, count } =
    useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [appliedCode, setAppliedCode] = useState(null);

  // Free shipping threshold calculations
  const FREE_SHIPPING_THRESHOLD = 80;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const freeShippingProgress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  // Ask the backend whether the promo code is valid
  const handleApplyPromo = async (e) => {
    e.preventDefault();
    const cleanCode = promoCode.trim();
    if (!cleanCode) return;

    try {
      const promo = await api.validatePromo(cleanCode);
      setDiscountPercent(promo.discount_percent);
      setAppliedCode(promo.code);
      setPromoMessage({ type: 'success', text: promo.message });
    } catch (err) {
      setDiscountPercent(0);
      setAppliedCode(null);
      setPromoMessage({ type: 'error', text: err.message });
    }
  };

  const discountAmount = Number(((total * discountPercent) / 100).toFixed(2));
  const finalPayable = Number((Math.max(0, total - discountAmount) + shipping).toFixed(2));

  // Checkout: the backend recalculates the prices and saves the order in MongoDB
  const handleCheckout = async () => {
    if (cart.length === 0 || checkoutSuccess) return;
    setCheckoutSuccess(true);
    try {
      const order = await api.checkout({ items: cart, promoCode: appliedCode });
      alert(
        `🎉 Order placed!\n\nOrder #${order.shortId}\nTotal: ${formatCurrency(order.total)}\nItems: ${count}\n\nThank you for shopping with Giftora AI. (No real payment is taken in this demo.)`
      );
      clearCart();
      setPromoCode('');
      setDiscountPercent(0);
      setAppliedCode(null);
      setPromoMessage(null);
    } catch (err) {
      alert(`Sorry, the order could not be placed.\n\n${err.message}`);
    } finally {
      setCheckoutSuccess(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="giftora-cart-empty app-container">
        <div className="giftora-cart-empty__card">
          <div className="giftora-cart-empty__icon">
            <ShoppingBag size={54} />
          </div>
          <h2>Your Shopping Bag is Empty</h2>
          <p>
            You haven't selected any gifts yet. Explore our curated catalog or use the AI Gift Box
            Builder to create a personalized package.
          </p>
          <div className="giftora-cart-empty__actions">
            <Link to="/shop">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                Start Shopping
              </Button>
            </Link>
            <Link to="/gift-box">
              <Button variant="outline" size="lg" icon={<Gift size={18} />}>
                Build a Gift Box
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="giftora-cart-page app-container">
      {/* Header */}
      <div className="giftora-cart-header">
        <div>
          <div className="section-eyebrow">Checkout Review</div>
          <h1 className="shopping-title"> <ShoppingBag size={34} />Shopping Bag ({count} {count === 1 ? 'item' : 'items'})</h1>
        </div>
        <button
          type="button"
          className="giftora-cart-clear-btn"
          onClick={() => {
            if (window.confirm('Are you sure you want to clear your bag?')) {
              clearCart();
            }
          }}
        >
          Clear bag
        </button>
      </div>

      {/* Free Shipping Progress Notification */}
      <div className="giftora-cart-shipping-banner">
        <div className="giftora-cart-shipping-banner__header">
          <Truck size={20} className="giftora-cart-shipping-icon" />
          <span>
            {amountToFreeShipping > 0 ? (
              <>
                Add <strong>{formatCurrency(amountToFreeShipping)}</strong> more to unlock{' '}
                <strong>FREE Express Shipping</strong>!
              </>
            ) : (
              <>
                🎉 You have unlocked <strong>FREE Express Delivery</strong>!
              </>
            )}
          </span>
        </div>
        <div className="giftora-cart-progress-track">
          <div
            className="giftora-cart-progress-fill"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="giftora-cart-layout">
        {/* Left: Cart Items List */}
        <div className="giftora-cart-items">
          {cart.map((item) => (
            <div key={item.id} className="giftora-cart-item">
              <Link to={`/product/${item.id}`} className="giftora-cart-item__image-wrap">
                <img src={item.image} alt={item.name} className="giftora-cart-item__image" />
              </Link>

              <div className="giftora-cart-item__details">
                <span className="giftora-cart-item__category">{item.category}</span>
                <h3 className="giftora-cart-item__title">
                  <Link to={`/product/${item.id}`}>{item.name}</Link>
                </h3>
                <span className="giftora-cart-item__unit-price">
                  {formatCurrency(item.price)} each
                </span>

                <div className="giftora-cart-item__bottom">
                  {/* Quantity Modifier */}
                  <div className="giftora-cart-item__qty">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="giftora-cart-item__subtotal">
                    {formatCurrency(item.price * item.qty)}
                  </span>

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="giftora-cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from bag`}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping Link */}
          <div className="giftora-cart-continue">
            <Link to="/shop" className="giftora-cart-continue__link">
              ← Continue browsing gifts
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="giftora-cart-summary">
          <div className="giftora-cart-summary__card">
            <h3>Order Summary</h3>

            {/* Calculations Table */}
            <div className="giftora-cart-summary__row">
              <span>Subtotal ({count} items)</span>
              <span>{formatCurrency(total)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="giftora-cart-summary__row giftora-cart-summary__row--discount">
                <span>Discount ({discountPercent}%)</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="giftora-cart-summary__row">
              <span className="giftora-cart-summary__shipping-label">
                Estimated Shipping
                {shipping === 0 && <span className="free-badge">FREE</span>}
              </span>
              <span>{formatCurrency(shipping)}</span>
            </div>

            <div className="giftora-cart-summary__row">
              <span>Gift Wrapping & Wax Seal</span>
              <span className="giftora-cart-summary__free-wrap">Complimentary</span>
            </div>

            <div className="giftora-cart-summary__divider" />

            {/* Grand Total */}
            <div className="giftora-cart-summary__total-row">
              <div>
                <strong>Total Amount</strong>
                <span>Taxes included</span>
              </div>
              <span className="giftora-cart-summary__grand-price">{formatCurrency(finalPayable)}</span>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="giftora-cart-promo-form">
              <div className="giftora-cart-promo-input-wrap">
                <Tag size={16} className="giftora-cart-promo-icon" />
                <input
                  type="text"
                  placeholder="Promo code (e.g. GIFTORA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="submit" className="giftora-cart-promo-btn">
                  Apply
                </button>
              </div>
              {promoMessage && (
                <span
                  className={`giftora-cart-promo-msg giftora-cart-promo-msg--${promoMessage.type}`}
                >
                  {promoMessage.text}
                </span>
              )}
            </form>

            {/* Checkout Button */}
            <Button
              variant="primary"
              size="lg"
              className="giftora-cart-checkout-btn"
              onClick={handleCheckout}
              disabled={checkoutSuccess}
              icon={checkoutSuccess ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
            >
              {checkoutSuccess ? 'Placing order...' : `Proceed to Checkout • ${formatCurrency(finalPayable)}`}
            </Button>

            {/* Guarantees */}
            <div className="giftora-cart-summary__trust">
              <div className="giftora-cart-summary__trust-item">
                <ShieldCheck size={15} color="var(--primary)" />
                <span>30-Day Happiness Guarantee</span>
              </div>
              <div className="giftora-cart-summary__trust-item">
                <Truck size={15} color="var(--accent)" />
                <span>Tracked Courier Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
