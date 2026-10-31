"""The main rule of the project: NO token (or a fake token) = NO data."""
import pytest

PROTECTED = [
    ("GET", "/api/products"),
    ("GET", "/api/products/1"),
    ("GET", "/api/cart"),
    ("PUT", "/api/cart"),
    ("DELETE", "/api/cart"),
    ("GET", "/api/gift-box"),
    ("PUT", "/api/gift-box"),
    ("POST", "/api/gift-box/suggest"),
    ("POST", "/api/orders"),
    ("GET", "/api/orders"),
    ("GET", "/api/orders/abc"),
    ("POST", "/api/promo/validate"),
    ("POST", "/api/chat"),
    ("GET", "/api/chat/history"),
    ("GET", "/api/auth/me"),
]


@pytest.mark.parametrize("method,path", PROTECTED)
def test_requires_login(client, method, path):
    assert client.request(method, path).status_code == 401
    assert client.request(method, path, headers={"Authorization": "Bearer fake.token.value"}).status_code == 401


def test_public_routes(client):
    assert client.get("/api/health").status_code == 200


def test_token_of_deleted_user_is_rejected(client, auth_headers):
    import asyncio
    from app.api.deps import get_database
    from app.main import app

    assert client.get("/api/auth/me", headers=auth_headers).status_code == 200
    db = app.dependency_overrides[get_database]()
    asyncio.run(db.users.delete_many({}))
    assert client.get("/api/auth/me", headers=auth_headers).status_code == 401


def test_expired_token_is_rejected(client):
    import jwt
    from datetime import datetime, timedelta, timezone
    from app.core.config import get_settings

    s = get_settings()
    old = jwt.encode({"sub": "665f1c2e9b1e8a0012345678", "exp": datetime.now(timezone.utc) - timedelta(minutes=1)},
                     s.jwt_secret_key, algorithm=s.jwt_algorithm)
    assert client.get("/api/products", headers={"Authorization": f"Bearer {old}"}).status_code == 401
