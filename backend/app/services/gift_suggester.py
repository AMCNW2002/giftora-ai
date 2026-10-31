"""
"AI" gift box curator (a simple scoring + greedy packing algorithm).
1. Give every product a score  (rating + bonus if the category suits the recipient
   + bonus if the product matches the user's interests)
2. Sort by score (best first)
3. Pack the best products into the box until the budget / 5 items is reached
"""
AFFINITY = {
    "partner": ["jewelry", "flowers", "personalized"],
    "friend": ["hampers", "personalized", "tech"],
    "parent": ["hampers", "personalized", "flowers"],
    "colleague": ["tech", "hampers", "personalized"],
}
MAX_ITEMS = 5


def suggest_box(products: list[dict], recipient: str, budget: float, interests: str) -> dict:
    preferred = AFFINITY.get(recipient, ["personalized", "hampers"])
    interest = interests.strip().lower()

    def score(p: dict) -> float:
        s = p["rating"]
        if p["category"] in preferred:
            s += 3.5
        if interest and (interest in p["name"].lower() or interest in p["description"].lower()):
            s += 2.5
        return s

    ranked = sorted(products, key=score, reverse=True)

    picked, spent = [], 0.0
    for p in ranked:
        if len(picked) >= MAX_ITEMS:
            break
        if spent + p["price"] <= budget:
            picked.append({**p, "qty": 1})
            spent += p["price"]

    spent = round(spent, 2)
    return {"items": picked, "total_spent": spent, "remaining": round(max(0.0, budget - spent), 2)}
