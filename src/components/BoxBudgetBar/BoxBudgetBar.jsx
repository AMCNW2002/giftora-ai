import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import './BoxBudgetBar.css';

/**
 * BoxBudgetBar Component
 * Renders budget comparison, progress bar that turns red if over budget,
 * and remaining / overbudget status.
 */
export function BoxBudgetBar({ total = 0, budget = 100, remaining = 0, isOverBudget = false }) {
  const percentage = Math.min(100, Math.round((total / budget) * 100)) || 0;
  const overAmount = Math.abs(remaining).toFixed(2);

  return (
    <div className="giftora-budget-bar">
      {/* Top Labels */}
      <div className="giftora-budget-bar__labels">
        <span className="giftora-budget-bar__title">Box Total</span>
        <div className="giftora-budget-bar__amounts">
          <span className={`giftora-budget-bar__current ${isOverBudget ? 'text-danger' : ''}`}>
            ${total.toFixed(2)}
          </span>
          <span className="giftora-budget-bar__divider">/</span>
          <span className="giftora-budget-bar__target">${Number(budget).toFixed(2)} target</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className={`giftora-budget-bar__track ${isOverBudget ? 'giftora-budget-bar__track--over' : ''}`}>
        <div
          className={`giftora-budget-bar__fill ${
            isOverBudget ? 'giftora-budget-bar__fill--over' : ''
          }`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      {/* Status Hint Line */}
      <div className="giftora-budget-bar__status">
        {isOverBudget ? (
          <span className="giftora-budget-bar__status-text giftora-budget-bar__status-text--over">
            <AlertCircle size={15} /> Over budget by ${overAmount}
          </span>
        ) : (
          <span className="giftora-budget-bar__status-text giftora-budget-bar__status-text--ok">
            <CheckCircle2 size={15} /> ${remaining.toFixed(2)} remaining to spend
          </span>
        )}
        <span className="giftora-budget-bar__percent">{percentage}% used</span>
      </div>
    </div>
  );
}

export default BoxBudgetBar;
