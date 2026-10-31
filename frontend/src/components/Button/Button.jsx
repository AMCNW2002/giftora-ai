import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 * @param {('primary'|'outline'|'ghost')} variant - Button style variant
 * @param {('sm'|'md'|'lg')} size - Button size
 * @param {React.ReactNode} children - Button text or inner elements
 * @param {React.ReactNode} icon - Optional icon node placed before or after
 * @param {string} className - Optional custom classes
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const classes = [
    'giftora-btn',
    `giftora-btn--${variant}`,
    `giftora-btn--${size}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="giftora-btn__icon">{icon}</span>}
      <span className="giftora-btn__text">{children}</span>
    </button>
  );
}

export default Button;
