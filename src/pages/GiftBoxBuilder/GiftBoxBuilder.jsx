import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Gift,
  Plus,
  Check,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react';
import { useGiftBox, RIBBON_COLORS } from '../../context/GiftBoxContext';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { BoxBudgetBar } from '../../components/BoxBudgetBar/BoxBudgetBar';
import { BoxItemCard } from '../../components/BoxItemCard/BoxItemCard';
import { Button } from '../../components/Button/Button';
import { formatCurrency } from '../../utils/currency';
import './GiftBoxBuilder.css';

export function GiftBoxBuilder() {
  const {
    box,
    setBudget,
    addItem,
    removeItem,
    updateQty,
    setRibbon,
    setMessage,
    setRecipient,
    setOccasion,
    setInterests,
    replaceItems,
    clearBox,
    total,
    remaining,
    isOverBudget,
    isEmpty,
    count,
    ribbonInfo
  } = useGiftBox();

  const { addToCart } = useCart();

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [addedSuccessToast, setAddedSuccessToast] = useState(false);

  // Greedy Knapsack AI Algorithm
  const handleGenerateBox = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setAddedSuccessToast(false);

    setTimeout(() => {
      // 1. Category affinity map
      const affinity = {
        partner: ['jewelry', 'flowers', 'personalized'],
        friend: ['hampers', 'personalized', 'tech'],
        parent: ['hampers', 'personalized', 'flowers'],
        colleague: ['tech', 'hampers', 'personalized']
      };

      const preferredCategories = affinity[box.recipient] || ['personalized', 'hampers'];

      // 2. Score items
      const scored = products.map((item) => {
        let score = item.rating; // Base rating score (e.g. 4.5 - 4.9)
        if (preferredCategories.includes(item.category)) {
          score += 3.5; // Affinity boost
        }
        if (
          box.interests &&
          (item.name.toLowerCase().includes(box.interests.toLowerCase()) ||
            item.description.toLowerCase().includes(box.interests.toLowerCase()))
        ) {
          score += 2.5; // Keyword interest boost
        }
        return { item, score };
      });

      // 3. Sort descending by score
      scored.sort((a, b) => b.score - a.score);

      // 4. Greedy Knapsack packing (up to 5 items fitting within budget)
      let currentSpent = 0;
      const picked = [];

      for (const { item } of scored) {
        if (picked.length >= 5) break;
        if (currentSpent + item.price <= box.budget) {
          picked.push({ ...item, qty: 1 });
          currentSpent += item.price;
        }
      }

      // If budget was high and nothing was picked or very few, pick at least best fit item
      if (picked.length === 0) {
        const affordable = products.filter((p) => p.price <= box.budget);
        if (affordable.length > 0) {
          picked.push({ ...affordable[0], qty: 1 });
        }
      }

      replaceItems(picked);
      setIsGenerating(false);
      setHasGeneratedOnce(true);
    }, 900);
  };

  // Reactively filter products available to add (not in box & price <= remaining)
  const currentItemIds = new Set(box.items.map((i) => i.id));
  const suggestedAdditions = products.filter((p) => {
    return !currentItemIds.has(p.id) && (isOverBudget ? p.price <= 25 : p.price <= remaining);
  });

  // Transfer all box items into the main shopping bag
  const handleAddBoxToCart = () => {
    if (isEmpty || isOverBudget) return;

    box.items.forEach((item) => {
      addToCart(item, item.qty);
    });

    setAddedSuccessToast(true);
    setTimeout(() => {
      setAddedSuccessToast(false);
    }, 4500);
  };

  return (
    <div className="giftora-builder app-container">
      {/* Page Title & Eyebrow */}
      <div className="giftora-builder__header">
        <div className="section-eyebrow">
          <Sparkles size={14} /> Bespoke AI Experience
        </div>
        <h1>Custom Gift Box Builder</h1>
      </div>

      {/* Main Two-Column Layout */}
      <div className="giftora-builder__grid">
        {/* ========================================================= */}
        {/* LEFT COLUMN: AI ASSISTANT FORM & QUICK-ADD SHELF           */}
        {/* ========================================================= */}
        <div className="giftora-builder__left-col">
          {/* AI Form Card */}
          <div className="giftora-builder__card giftora-builder__ai-card">
            <div className="giftora-builder__card-title">
              <Sparkles size={18} className="giftora-builder__card-icon" />
              <h3>AI Box Curator</h3>
            </div>

            <form onSubmit={handleGenerateBox} className="giftora-builder__form">
              {/* Recipient */}
              <div className="giftora-builder__field">
                <label htmlFor="box-recipient">Who is this for?</label>
                <select
                  id="box-recipient"
                  value={box.recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                >
                  <option value="partner">Partner / Spouse</option>
                  <option value="friend">Best Friend</option>
                  <option value="parent">Parent / Family</option>
                  <option value="colleague">Colleague / Executive</option>
                </select>
              </div>

              {/* Occasion */}
              <div className="giftora-builder__field">
                <label htmlFor="box-occasion">What is the occasion?</label>
                <select
                  id="box-occasion"
                  value={box.occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                >
                  <option value="birthday">Birthday Milestone</option>
                  <option value="anniversary">Romantic Anniversary</option>
                  <option value="wedding">Wedding / Engagement</option>
                  <option value="holiday">Holiday / Appreciation</option>
                </select>
              </div>

              {/* Budget */}
              <div className="giftora-builder__field">
                <label htmlFor="box-budget">Set Your Box Budget (Rs.)</label>
                <div className="giftora-builder__budget-input-wrap">
                  <span className="currency-prefix">Rs.</span>
                  <input
                    id="box-budget"
                    type="number"
                    min="20"
                    max="1000"
                    step="5"
                    value={box.budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Interests / Notes */}
              <div className="giftora-builder__field">
                <label htmlFor="box-interests">Specific Interests (Optional)</label>
                <input
                  id="box-interests"
                  type="text"
                  placeholder="e.g. coffee, rose, tech, relaxation, chocolates"
                  value={box.interests}
                  onChange={(e) => setInterests(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isGenerating}
                className="giftora-builder__gen-btn"
                icon={
                  isGenerating ? (
                    <div className="animate-spin" style={{ display: 'inline-block' }}>
                      ✨
                    </div>
                  ) : (
                    <Sparkles size={18} />
                  )
                }
              >
                {isGenerating
                  ? 'Curating Box with AI...'
                  : hasGeneratedOnce
                  ? 'Regenerate Box'
                  : 'Generate My Box'}
              </Button>
            </form>
          </div>

          {/* "Add more to your box" Reactive Suggestions Shelf */}
          <div className="giftora-builder__shelf">
            <div className="giftora-builder__shelf-header">
              <h4>Add more to your box</h4>
              <span className="giftora-builder__shelf-hint">
                {isOverBudget
                  ? 'Over budget'
                  : `Items under ${formatCurrency(remaining)}`}
              </span>
            </div>

            {suggestedAdditions.length > 0 ? (
              <div className="giftora-builder__shelf-grid">
                {suggestedAdditions.slice(0, 4).map((product) => (
                  <div key={product.id} className="giftora-builder__mini-card">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="giftora-builder__mini-img"
                    />
                    <div className="giftora-builder__mini-info">
                      <h5>{product.name}</h5>
                      <span className="giftora-builder__mini-price">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="giftora-builder__mini-add"
                      onClick={() => addItem(product, 1)}
                      aria-label={`Add ${product.name} to box`}
                      title="Add to gift box"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="giftora-builder__shelf-empty">
                {isOverBudget
                  ? 'Your box has reached its target budget. Increase the budget to see more suggestions.'
                  : 'No additional individual items fit within the remaining budget. Try bumping your budget!'}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: GIFT BOX CANVAS & PACKING REVIEW             */}
        {/* ========================================================= */}
        <div className="giftora-builder__right-col">
          <div className="giftora-builder__canvas">
            {/* Top Decorative Ribbon Strip */}
            <div
              className="giftora-builder__ribbon-strip"
              style={{ backgroundColor: ribbonInfo.hex }}
              title={`Hand-tied in ${ribbonInfo.label} satin ribbon`}
            >
              <span>Hand-tied Satin Ribbon: {ribbonInfo.label}</span>
            </div>

            <div className="giftora-builder__canvas-body">
              {/* Canvas Header */}
              <div className="giftora-builder__canvas-header">
                <div>
                  <h2>Your Gift Box</h2>
                  <span className="giftora-builder__item-count">
                    {count} {count === 1 ? 'item' : 'items'} packed
                  </span>
                </div>
                {!isEmpty && (
                  <button
                    type="button"
                    className="giftora-builder__clear-btn"
                    onClick={() => {
                      if (window.confirm('Clear all items from your gift box?')) {
                        clearBox();
                      }
                    }}
                  >
                    Clear Box
                  </button>
                )}
              </div>

              {/* Budget Progress Bar */}
              <BoxBudgetBar
                total={total}
                budget={box.budget}
                remaining={remaining}
                isOverBudget={isOverBudget}
              />

              {/* Items List or Empty State */}
              <div className="giftora-builder__items-list">
                {!isEmpty ? (
                  box.items.map((item) => (
                    <BoxItemCard
                      key={item.id}
                      item={item}
                      onUpdateQty={updateQty}
                      onRemove={removeItem}
                    />
                  ))
                ) : (
                  <div className="giftora-builder__empty-canvas">
                    <div className="giftora-builder__empty-icon">
                      <Gift size={42} />
                    </div>
                    <h4>Your box is waiting to be filled</h4>
                    <p>
                      Click <strong>"Generate My Box"</strong> on the left or add individual items
                      from the suggestion shelf below.
                    </p>
                  </div>
                )}
              </div>

              {/* Ribbon Color Swatch Picker */}
              <div className="giftora-builder__ribbon-picker">
                <label className="giftora-builder__picker-label">Choose Satin Ribbon Color:</label>
                <div className="giftora-builder__swatches">
                  {Object.entries(RIBBON_COLORS).map(([key, data]) => {
                    const isSelected = box.ribbon === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`giftora-builder__swatch ${
                          isSelected ? 'giftora-builder__swatch--selected' : ''
                        }`}
                        style={{ backgroundColor: data.hex }}
                        onClick={() => setRibbon(key)}
                        aria-label={`Select ${data.label} ribbon`}
                        title={data.label}
                      >
                        {isSelected && <Check size={14} color="#ffffff" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calligraphy Gift Note with 140 Character Limit */}
              <div className="giftora-builder__message-wrap">
                <div className="giftora-builder__message-header">
                  <label htmlFor="box-message">Complimentary Calligraphy Note:</label>
                  <span
                    className={`giftora-builder__char-count ${
                      box.message.length >= 135 ? 'text-danger' : ''
                    }`}
                  >
                    {box.message.length} / 140
                  </span>
                </div>
                <textarea
                  id="box-message"
                  rows="3"
                  maxLength="140"
                  placeholder="Write a heartfelt personal message. It will be embossed on parchment paper with a classic wax seal..."
                  value={box.message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Success Notification */}
              {addedSuccessToast && (
                <div className="giftora-builder__toast animate-fade-up">
                  <div className="giftora-builder__toast-content">
                    <Check size={18} />
                    <span>Gift box items added to your shopping bag!</span>
                  </div>
                  <Link to="/cart" className="giftora-builder__toast-link">
                    View Cart →
                  </Link>
                </div>
              )}

              {/* Add Box to Cart Action Button */}
              <div className="giftora-builder__actions-wrap">
                <Button
                  variant="primary"
                  size="lg"
                  className="giftora-builder__add-cart-btn"
                  disabled={isEmpty || isOverBudget}
                  onClick={handleAddBoxToCart}
                  icon={<ShoppingBag size={18} />}
                >
                  {isEmpty
                    ? 'Fill Box to Continue'
                    : isOverBudget
                    ? `Over Budget — ${formatCurrency(total)}`
                    : `Add Gift Box to Cart — ${formatCurrency(total)}`}
                </Button>

                {isOverBudget && (
                  <p className="giftora-builder__warning-text">
                    <AlertTriangle size={15} /> Your total exceeds your budget of {formatCurrency(box.budget)}.
                    Please remove an item or increase your budget to proceed.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="giftora-builder__preview-stage" aria-labelledby="gift-preview-title">
        <div className="giftora-builder__preview-copy">
          <span className="section-eyebrow"><Sparkles size={14} /> A little preview</span>
          <h2 id="gift-preview-title">Your gift, beautifully wrapped</h2>
          <p>
            {isEmpty
              ? 'Your personalised gift box preview will take shape as you add items.'
              : `${count} ${count === 1 ? 'thoughtful detail' : 'thoughtful details'} in your gift box, finished with ${ribbonInfo.label.toLowerCase()} ribbon.`}
          </p>
        </div>
        <div
          className="giftora-builder__preview-art"
          role="img"
          aria-label={`Illustration of a gift box with ${ribbonInfo.label.toLowerCase()} ribbon`}
        >
          <div className="giftora-builder__gift-shadow" />
          <div className="giftora-builder__gift-box">
            <div className="giftora-builder__gift-lid" />
            <div className="giftora-builder__gift-front" />
            <div className="giftora-builder__gift-side" />
            <div
              className="giftora-builder__gift-ribbon giftora-builder__gift-ribbon--vertical"
              style={{ backgroundColor: ribbonInfo.hex }}
            />
            <div
              className="giftora-builder__gift-ribbon giftora-builder__gift-ribbon--horizontal"
              style={{ backgroundColor: ribbonInfo.hex }}
            />
            <div className="giftora-builder__gift-bow">
              <span style={{ backgroundColor: ribbonInfo.hex }} />
              <span style={{ backgroundColor: ribbonInfo.hex }} />
              <i style={{ backgroundColor: ribbonInfo.hex }} />
            </div>
          </div>
          {!isEmpty && (
            <span className="giftora-builder__preview-count">
              <Gift size={14} /> {count} {count === 1 ? 'item' : 'items'} selected
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

export default GiftBoxBuilder;
