from fastapi.testclient import TestClient
from app.main import app
from app.core.security import get_password_hash, verify_password
from app.core.csrf import generate_csrf_token, validate_csrf_token
from app.database import SessionLocal
from app.models.user import User

client = TestClient(app)


def get_authenticated_csrf_headers():
    """Helper to fetch CSRF token and return headers with cookies for test requests."""
    res = client.get("/api/csrf-token")
    assert res.status_code == 200
    token = res.json()["csrf_token"]
    return {
        "X-CSRF-Token": token,
        "Cookie": f"csrftoken={token}",
    }


def test_cors_configuration():
    """Verify CORS preflight and headers for frontend origin http://localhost:3000."""
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "X-CSRF-Token, Content-Type, Authorization",
    }
    res = client.options("/api/auth/login", headers=headers)
    assert res.status_code == 200, f"CORS preflight failed: {res.status_code} {res.text}"
    assert res.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert res.headers.get("access-control-allow-credentials") == "true"
    assert "POST" in res.headers.get("access-control-allow-methods", "")
    print("✅ CORS configuration verified (http://localhost:3000 allowed with credentials)")


def test_csrf_protection():
    """Verify CSRF token generation, enforcement, and rejection of invalid/missing tokens."""
    # 1. Fetch CSRF token endpoint
    res = client.get("/api/csrf-token")
    assert res.status_code == 200
    data = res.json()
    assert "csrf_token" in data
    token = data["csrf_token"]
    assert validate_csrf_token(token) is True
    assert "csrftoken" in res.headers.get("set-cookie", "")

    # 2. Mutating request (POST) WITHOUT CSRF token must fail with 403 Forbidden
    res_no_csrf = client.post("/api/inquiries", json={
        "name": "Attacker",
        "email": "attacker@evil.com",
        "message": "CSRF attack attempt",
    })
    assert res_no_csrf.status_code == 403
    assert "CSRF verification failed" in res_no_csrf.json()["detail"]

    # 3. Mutating request with INVALID/TAMPERED CSRF token must fail with 403 Forbidden
    res_bad_csrf = client.post(
        "/api/inquiries",
        json={"name": "Attacker", "email": "attacker@evil.com", "message": "CSRF attack attempt"},
        headers={"X-CSRF-Token": "invalid.tampered.token123"},
    )
    assert res_bad_csrf.status_code == 403

    # 4. Mutating request with cookie/header MISMATCH must fail with 403 Forbidden
    res_mismatch = client.post(
        "/api/inquiries",
        json={"name": "Attacker", "email": "attacker@evil.com", "message": "CSRF attack attempt"},
        headers={
            "X-CSRF-Token": token,
            "Cookie": "csrftoken=different_token_cookie",
        },
    )
    assert res_mismatch.status_code == 403

    print("✅ CSRF protection verified (Missing/invalid/mismatched tokens blocked with 403)")


def test_argon2id_hashing():
    """Verify Argon2id hash generation and verification parameters."""
    pwd = "SecurePassword@2026!"
    hashed = get_password_hash(pwd)
    
    # Verify hash algorithm signature
    assert hashed.startswith("$argon2id$"), f"Expected $argon2id$ hash prefix, got {hashed[:15]}"
    assert "m=65536,t=3,p=4" in hashed, f"Expected OWASP memory/time/parallelism parameters, got {hashed}"
    
    # Verify valid and invalid checks
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword@123", hashed) is False
    assert verify_password("", hashed) is False
    assert verify_password(pwd, "") is False
    print("✅ Argon2id hashing & verification tests passed ($argon2id$, m=65536, t=3, p=4)")


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    print("✅ /api/health passed")


def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["docs"] == "/api/docs"
    print("✅ / passed")


def test_plans():
    res = client.get("/api/plans")
    assert res.status_code == 200
    plans = res.json()
    assert len(plans) >= 4
    print(f"✅ /api/plans passed (retrieved {len(plans)} plans)")


def test_login_and_auth():
    csrf_headers = get_authenticated_csrf_headers()

    # Admin login with email & password + CSRF token
    res = client.post(
        "/api/auth/login",
        json={"email": "admin@gymforce.com", "password": "Admin@123"},
        headers=csrf_headers,
    )
    assert res.status_code == 200
    token = res.json()["access_token"]
    assert token
    auth_headers = {**csrf_headers, "Authorization": f"Bearer {token}"}
    print("✅ /api/auth/login (Admin + CSRF) passed")

    # Case-insensitive email login
    res_case = client.post(
        "/api/auth/login",
        json={"email": "ADMIN@GYMFORCE.COM", "password": "Admin@123"},
        headers=csrf_headers,
    )
    assert res_case.status_code == 200
    print("✅ /api/auth/login (Case-insensitive email) passed")

    # Invalid password login check
    res_bad = client.post(
        "/api/auth/login",
        json={"email": "admin@gymforce.com", "password": "WrongPassword!"},
        headers=csrf_headers,
    )
    assert res_bad.status_code == 401
    print("✅ /api/auth/login (Invalid password rejection) passed")

    # /api/auth/me
    res_me = client.get("/api/auth/me", headers=auth_headers)
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "admin@gymforce.com"
    print("✅ /api/auth/me passed")

    # /api/dashboard/summary
    res_dash = client.get("/api/dashboard/summary", headers=auth_headers)
    assert res_dash.status_code == 200
    summary = res_dash.json()
    assert "total_members" in summary
    assert "total_revenue" in summary
    print(f"✅ /api/dashboard/summary passed (Revenue: ₹{summary['total_revenue']}, Members: {summary['total_members']})")

    # /api/members
    res_members = client.get("/api/members", headers=auth_headers)
    assert res_members.status_code == 200
    print(f"✅ /api/members passed (Count: {len(res_members.json())})")


def test_user_registration():
    """Test registering a new user with email, password, and CSRF token."""
    test_email = "newmember_argon2@gymforce.com"
    csrf_headers = get_authenticated_csrf_headers()
    
    # Delete existing test user if any
    db = SessionLocal()
    existing = db.query(User).filter(User.email == test_email).first()
    if existing:
        db.delete(existing)
        db.commit()
    db.close()

    reg_payload = {
        "email": test_email,
        "password": "StrongMemberPassword#2026",
        "full_name": "Argon2 Test User",
        "phone": "+91 91234 56789",
        "gender": "male",
        "gym": "GymForce HQ",
    }
    res = client.post("/api/auth/register", json=reg_payload, headers=csrf_headers)
    assert res.status_code == 201, f"Registration failed: {res.text}"
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_email
    print("✅ /api/auth/register (Argon2id hashing + CSRF) passed")

    # Verify stored hash format in database
    db = SessionLocal()
    user_in_db = db.query(User).filter(User.email == test_email).first()
    assert user_in_db is not None
    assert user_in_db.hashed_password.startswith("$argon2id$")
    db.close()
    print("✅ Verified database stores $argon2id$ hash for newly registered user")

    # Verify login with newly registered user
    login_res = client.post(
        "/api/auth/login",
        json={
            "email": test_email,
            "password": "StrongMemberPassword#2026",
        },
        headers=csrf_headers,
    )
    assert login_res.status_code == 200
    print("✅ /api/auth/login with newly registered user passed")


def test_public_inquiry_and_trial():
    csrf_headers = get_authenticated_csrf_headers()

    # Submit inquiry with CSRF token
    res_inq = client.post(
        "/api/inquiries",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+91 99999 11111",
            "interest": "Personal Training",
            "message": "Interested in a free consultation",
        },
        headers=csrf_headers,
    )
    assert res_inq.status_code == 201
    print("✅ /api/inquiries (POST + CSRF) passed")

    # Clean up test trial if exists to keep test idempotent
    from app.models.subscription import Trial
    db = SessionLocal()
    db.query(Trial).filter(Trial.phone == "+91 99999 22222").delete()
    db.commit()
    db.close()

    # Request trial with CSRF token
    res_trial = client.post(
        "/api/subscriptions/trials",
        json={
            "phone": "+91 99999 22222",
        },
        headers=csrf_headers,
    )
    assert res_trial.status_code == 201
    print("✅ /api/subscriptions/trials (POST + CSRF) passed")


if __name__ == "__main__":
    print("🧪 Running FastAPI API endpoint, CORS, CSRF, and Argon2id security tests...\n")
    test_cors_configuration()
    test_csrf_protection()
    test_argon2id_hashing()
    test_health()
    test_root()
    test_plans()
    test_login_and_auth()
    test_user_registration()
    test_public_inquiry_and_trial()
    print("\n🎉 All tests passed successfully with CORS, CSRF, and Argon2id protection!")


