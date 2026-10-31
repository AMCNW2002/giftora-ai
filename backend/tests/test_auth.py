from tests.conftest import USER


def test_register_and_login(client):
    r = client.post("/api/auth/register", json=USER)
    assert r.status_code == 201
    body = r.json()
    assert body["user"]["email"] == USER["email"]
    assert "password_hash" not in body["user"]
    assert body["token"]

    r = client.post("/api/auth/login", json={"email": USER["email"].upper(), "password": USER["password"]})
    assert r.status_code == 200  # email is case-insensitive
    assert client.get("/api/auth/me", headers={"Authorization": f"Bearer {r.json()['token']}"}).json()["name"] == USER["name"]


def test_duplicate_email_rejected(client):
    client.post("/api/auth/register", json=USER)
    r = client.post("/api/auth/register", json={**USER, "email": USER["email"].upper()})
    assert r.status_code == 409


def test_wrong_password_and_unknown_email_look_the_same(client):
    client.post("/api/auth/register", json=USER)
    bad_pw = client.post("/api/auth/login", json={"email": USER["email"], "password": "Wrong12345"})
    no_user = client.post("/api/auth/login", json={"email": "nobody@example.com", "password": "Wrong12345"})
    assert bad_pw.status_code == no_user.status_code == 401
    assert bad_pw.json() == no_user.json()


def test_weak_or_invalid_input_rejected(client):
    assert client.post("/api/auth/register", json={**USER, "password": "short1"}).status_code == 422
    assert client.post("/api/auth/register", json={**USER, "password": "onlyletters"}).status_code == 422
    assert client.post("/api/auth/register", json={**USER, "email": "not-an-email"}).status_code == 422
    assert client.post("/api/auth/register", json={**USER, "password": "a1" * 40}).status_code == 422


def test_password_is_stored_hashed(client):
    import asyncio
    from app.api.deps import get_database
    from app.main import app

    client.post("/api/auth/register", json=USER)
    db = app.dependency_overrides[get_database]()
    doc = asyncio.run(db.users.find_one({"email": USER["email"]}))
    assert doc["password_hash"].startswith("$2")
    assert USER["password"] not in str(doc)
