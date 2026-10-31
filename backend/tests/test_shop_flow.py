def test_products(client, auth_headers):
    items = client.get("/api/products", headers=auth_headers).json()
    assert len(items) == 14 and "_id" not in items[0]
    assert items[0]["tag"] == "Bestseller"  # featured sort
    cheap = client.get("/api/products?sort=price-low&category=tech", headers=auth_headers).json()
    assert [p["price"] for p in cheap] == sorted(p["price"] for p in cheap)
    assert client.get("/api/products?category=Tech", headers=auth_headers).json()
    assert client.get("/api/products?search=lavender", headers=auth_headers).json()
    assert client.get("/api/products/9999", headers=auth_headers).status_code == 404


def test_case_insensitive_gift_box_data_is_accepted(client, auth_headers):
    r = client.post(
        "/api/gift-box/suggest",
        headers=auth_headers,
        json={"recipient": "Partner", "occasion": "Anniversary", "budget": 500, "interests": "rose"},
    )
    assert r.status_code == 200

    body = {"items": [{"product_id": 7, "qty": 1}], "budget": 300, "ribbon": "Gold", "message": "Hi!",
            "recipient": "Partner", "occasion": "Anniversary", "interests": "rose"}
    saved = client.put("/api/gift-box", headers=auth_headers, json=body)
    assert saved.status_code == 200
    assert saved.json()["ribbon"] == "gold"
    assert saved.json()["recipient"] == "partner"


def test_cart_is_saved_per_user(client, auth_headers, second_user_headers):
    r = client.put("/api/cart", headers=auth_headers, json={"items": [{"product_id": 8, "qty": 2}, {"product_id": 8, "qty": 1}]})
    assert r.status_code == 200
    assert r.json()["items"][0]["qty"] == 3  # duplicate lines merged
    assert r.json()["subtotal"] == 345.0 and r.json()["shipping"] == 0

    assert len(client.get("/api/cart", headers=auth_headers).json()["items"]) == 1
    assert client.get("/api/cart", headers=second_user_headers).json()["items"] == []  # other user sees nothing


def test_cart_validation(client, auth_headers):
    assert client.put("/api/cart", headers=auth_headers, json={"items": [{"product_id": 999, "qty": 1}]}).status_code == 400
    assert client.put("/api/cart", headers=auth_headers, json={"items": [{"product_id": 1, "qty": 0}]}).status_code == 422
    assert client.put("/api/cart", headers=auth_headers, json={"items": [{"product_id": 1, "qty": 1000}]}).status_code == 422


def test_checkout_uses_server_prices_and_promo(client, auth_headers, second_user_headers):
    client.put("/api/cart", headers=auth_headers, json={"items": [{"product_id": 7, "qty": 1}]})
    # the browser can only send ids + qty. Extra "price" is ignored.
    r = client.post("/api/orders", headers=auth_headers,
                    json={"items": [{"product_id": 7, "qty": 2, "price": 1}], "promo_code": "giftora10"})
    assert r.status_code == 201
    o = r.json()
    assert o["subtotal"] == 560.0 and o["discount_amount"] == 56.0 and o["total"] == 504.0
    assert o["promo_code"] == "GIFTORA10" and o["status"] == "placed"

    assert client.get("/api/cart", headers=auth_headers).json()["items"] == []  # bag cleared
    assert len(client.get("/api/orders", headers=auth_headers).json()) == 1
    assert client.get(f"/api/orders/{o['id']}", headers=auth_headers).status_code == 200
    # another registered user must NOT see this order
    assert client.get(f"/api/orders/{o['id']}", headers=second_user_headers).status_code == 404
    assert client.get("/api/orders", headers=second_user_headers).json() == []


def test_checkout_errors(client, auth_headers):
    assert client.post("/api/orders", headers=auth_headers, json={"items": []}).status_code == 422
    assert client.post("/api/orders", headers=auth_headers, json={"items": [{"product_id": 7, "qty": 1}], "promo_code": "NOPE"}).status_code == 400
    assert client.post("/api/promo/validate", headers=auth_headers, json={"code": "nope"}).status_code == 404
    assert client.post("/api/promo/validate", headers=auth_headers, json={"code": "delight"}).json()["discount_percent"] == 15


def test_shipping_fee_for_small_order(client, auth_headers):
    from app.core.config import get_settings
    from app.services.pricing import calculate_totals
    t = calculate_totals(50)
    assert t["shipping"] == get_settings().standard_shipping_fee and t["total"] == 59.99


def test_gift_box_draft_and_suggestion(client, auth_headers):
    assert client.get("/api/gift-box", headers=auth_headers).json()["items"] == []
    s = client.post("/api/gift-box/suggest", headers=auth_headers,
                    json={"recipient": "partner", "occasion": "anniversary", "budget": 1500, "interests": "rose"}).json()
    assert 0 < len(s["items"]) <= 5 and s["total_spent"] <= 1500
    assert s["total_spent"] + s["remaining"] == 1500

    body = {"items": [{"product_id": i["id"], "qty": i["qty"]} for i in s["items"]], "budget": 1500,
            "ribbon": "gold", "message": "Happy anniversary!", "recipient": "partner", "occasion": "anniversary", "interests": "rose"}
    assert client.put("/api/gift-box", headers=auth_headers, json=body).status_code == 200
    saved = client.get("/api/gift-box", headers=auth_headers).json()
    assert saved["ribbon"] == "gold" and len(saved["items"]) == len(s["items"])
    assert client.put("/api/gift-box", headers=auth_headers, json={**body, "ribbon": "pink"}).status_code == 422


def test_chat_is_saved(client, auth_headers):
    assert "delivery" in client.post("/api/chat", headers=auth_headers, json={"message": "Tell me about shipping"}).json()["reply"]
    assert client.post("/api/chat", headers=auth_headers, json={"message": ""}).status_code == 422
    history = client.get("/api/chat/history", headers=auth_headers).json()
    assert len(history) == 1 and history[0]["message"] == "Tell me about shipping"
