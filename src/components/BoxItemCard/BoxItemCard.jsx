import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import './BoxItemCard.css';

/**
 * BoxItemCard Component
 * Displays an individual product packed inside the custom gift box canvas.
 */
export function BoxItemCard({ item, onUpdateQty, onRemove }) {
  if (!item) return null;

  return (
    <div className="giftora-box-item">
      {/* Thumbnail */}
      <img src={item.image} alt={item.name} className="giftora-box-item__img" />

      {/* Info */}
      <div className="giftora-box-item__info">
        <span className="giftora-box-item__category">{item.category}</span>
        <h4 className="giftora-box-item__title">{item.name}</h4>
        <span className="giftora-box-item__price">${Number(item.price).toFixed(2)} each</span>
      </div>

      {/* Quantity & Actions */}
      <div className="giftora-box-item__actions">
        <div className="giftora-box-item__qty">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => onUpdateQty && onUpdateQty(item.id, item.qty - 1)}
          >
            <Minus size={13} />
          </button>
          <span>{item.qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => onUpdateQty && onUpdateQty(item.id, item.qty + 1)}
          >
            <Plus size={13} />
          </button>
        </div>

        <span className="giftora-box-item__total">
          ${(item.price * item.qty).toFixed(2)}
        </span>

        <button
          type="button"
          className="giftora-box-item__remove"
          onClick={() => onRemove && onRemove(item.id)}
          aria-label={`Remove ${item.name} from box`}
          title="Remove item"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default BoxItemCard;
