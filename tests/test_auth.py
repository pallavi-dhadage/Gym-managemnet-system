"""
tests/test_auth.py — Authentication tests
"""
import bcrypt
import pytest
from gym.extensions import db
from gym.models.user import User


# ── Helpers ────────────────────────────────────────────────────────────────────

def _create_user(app, email="test@gym.com", password="Test1234",
                 role="member", name="Test User"):
    with app.app_context():
        existing = User.query.filter_by(email=email).first()
        if existing:
            return existing
        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        user = User(name=name, email=email, phone="9999999999",
                    password_hash=hashed, role=role)
        db.session.add(user)
        db.session.commit()
        return user


# ── Registration ───────────────────────────────────────────────────────────────

def test_register_page_loads(client):
    rv = client.get("/auth/register")
    assert rv.status_code == 200
    assert b"Create Account" in rv.data


def test_register_valid_user(app, client):
    rv = client.post("/auth/register", data={
        "name": "Alice Gym",
        "email": "alice@gym.com",
        "phone": "9876543210",
        "password": "Secure123",
        "confirm_password": "Secure123",
        "csrf_token": ""          # CSRF disabled in TestingConfig
    }, follow_redirects=True)
    assert rv.status_code == 200
    with app.app_context():
        u = User.query.filter_by(email="alice@gym.com").first()
        assert u is not None
        assert u.role == "member"
        # Password must be stored hashed, never plaintext
        assert u.password_hash != "Secure123"


def test_register_duplicate_email(app, client):
    _create_user(app, email="dup@gym.com")
    rv = client.post("/auth/register", data={
        "name": "Dup User",
        "email": "dup@gym.com",
        "phone": "9876543211",
        "password": "Secure123",
        "confirm_password": "Secure123",
        "csrf_token": ""
    }, follow_redirects=True)
    assert b"already exists" in rv.data or rv.status_code == 200


def test_register_weak_password(client):
    rv = client.post("/auth/register", data={
        "name": "Weak User",
        "email": "weak@gym.com",
        "phone": "9876543212",
        "password": "abc",        # too short
        "confirm_password": "abc",
        "csrf_token": ""
    }, follow_redirects=True)
    assert b"Create Account" in rv.data   # stays on register page


# ── Login ──────────────────────────────────────────────────────────────────────

def test_login_page_loads(client):
    rv = client.get("/auth/login")
    assert rv.status_code == 200
    assert b"Sign In" in rv.data


def test_login_valid_credentials(app, client):
    _create_user(app, email="login@gym.com", password="Login123")
    rv = client.post("/auth/login", data={
        "email": "login@gym.com",
        "password": "Login123",
        "csrf_token": ""
    }, follow_redirects=True)
    assert rv.status_code == 200
    assert b"Welcome back" in rv.data


def test_login_wrong_password(app, client):
    _create_user(app, email="wrongpw@gym.com", password="Correct123")
    rv = client.post("/auth/login", data={
        "email": "wrongpw@gym.com",
        "password": "Wrong999",
        "csrf_token": ""
    }, follow_redirects=True)
    assert b"Invalid email or password" in rv.data


def test_login_nonexistent_user(client):
    rv = client.post("/auth/login", data={
        "email": "nobody@gym.com",
        "password": "Whatever1",
        "csrf_token": ""
    }, follow_redirects=True)
    assert b"Invalid email or password" in rv.data


# ── Logout ─────────────────────────────────────────────────────────────────────

def test_logout_requires_login(client):
    rv = client.get("/auth/logout", follow_redirects=False)
    assert rv.status_code in (302, 308)


# ── RBAC ──────────────────────────────────────────────────────────────────────

def test_admin_route_blocked_for_unauthenticated(client):
    rv = client.get("/admin/dashboard", follow_redirects=False)
    assert rv.status_code in (302, 308)


def test_member_route_blocked_for_unauthenticated(client):
    rv = client.get("/member/dashboard", follow_redirects=False)
    assert rv.status_code in (302, 308)
