"""
Money rules (shipping, promo codes). The SERVER decides the final price,
so a hacker cannot change prices from the browser.
"""
from app.core.config import get_settings

# promo code -> discount percent
PROMO_CODES = {
    "GIFTORA10": 10,
    "SAVE10": 10,
    "DELIGHT": 15,
}


def find_promo(code: str | None) -> tuple[str, int] | None:
    if not code:
        return None
    clean = code.strip().upper()
    percent = PROMO_CODES.get(clean)
    return (clean, percent) if percent else None


def calculate_totals(subtotal: float, discount_percent: int = 0) -> dict:
    settings = get_settings()
    subtotal = round(subtotal, 2)
    discount_amount = round(subtotal * discount_percent / 100, 2)
    # Same rule as the frontend: free shipping when the bag (before discount) >= threshold
    if subtotal == 0 or subtotal >= settings.free_shipping_threshold:
        shipping = 0.0
    else:
        shipping = settings.standard_shipping_fee
    total = round(max(0.0, subtotal - discount_amount) + shipping, 2)
    return {
        "subtotal": subtotal,
        "discount_percent": discount_percent,
        "discount_amount": discount_amount,
        "shipping": shipping,
        "total": total,
    }
