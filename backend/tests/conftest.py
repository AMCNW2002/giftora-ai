"""
Test setup. The tests use a FAKE in-memory MongoDB (mongomock), so you do NOT need
internet or Atlas to run them:    pip install -r requirements-dev.txt   then   pytest
"""
import asyncio
import os

# Fake settings must be set BEFORE the app is imported
os.environ["MONGODB_URI"] = "mongodb://fake-host:27017"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-test-secret-key-1234567890"

import pytest
from fastapi.testclient import TestClient
from mongomock_motor import AsyncMongoMockClient

from app.api.deps import get_database
from app.db.init_db import init_db
from app.main import app


@pytest.fixture()
def client():
    db = AsyncMongoMockClient()["giftora_test"]
    asyncio.run(init_db(db))  # indexes + starter products
    app.dependency_overrides[get_database] = lambda: db
    # No "with" block -> the real MongoDB startup (lifespan) is NOT run
    yield TestClient(app)
    app.dependency_overrides.clear()


USER = {"name": "Nimali Perera", "email": "nimali@example.com", "password": "Secret123"}


@pytest.fixture()
def auth_headers(client):
    token = client.post("/api/auth/register", json=USER).json()["token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def second_user_headers(client):
    other = {"name": "Kamal Silva", "email": "kamal@example.com", "password": "Another123"}
    token = client.post("/api/auth/register", json=other).json()["token"]
    return {"Authorization": f"Bearer {token}"}
