import React from 'react';
import './CategoryPills.css';

/**
 * Category filter pills component
 * @param {Array<{id: string, label: string}>} categories
 * @param {string} activeCategory
 * @param {Function} onSelect
 */
export function CategoryPills({ categories = [], activeCategory = 'all', onSelect }) {
  return (
    <div className="giftora-category-pills" role="tablist" aria-label="Gift Categories">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`giftora-category-pill ${isActive ? 'giftora-category-pill--active' : ''}`}
            onClick={() => onSelect && onSelect(cat.id)}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryPills;
