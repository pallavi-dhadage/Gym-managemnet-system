"""tests/test_leads.py — Lead / Enquiry module tests"""
import bcrypt
from gym.extensions import db
from gym.models.user import User
from gym.models.lead import Lead


# ── Helpers ────────────────────────────────────────────────────────────────────

def _make_admin(app):
    with app.app_context():
        u = User.query.filter_by(email="admin@gym.com").first()
        if u:
            return u
        pw = bcrypt.hashpw(b"Admin1234", bcrypt.gensalt()).decode()
        u = User(name="Admin", email="admin@gym.com",
                 phone="9000000000", password_hash=pw, role="admin")
        db.session.add(u)
        db.session.commit()
        return u


def _login_admin(client):
    return client.post("/auth/login", data={
        "email": "admin@gym.com",
        "password": "Admin1234",
        "csrf_token": ""
    }, follow_redirects=True)


# ── Public landing page ────────────────────────────────────────────────────────

def test_landing_page_loads(client):
    rv = client.get("/")
    assert rv.status_code == 200
    assert b"GymForce" in rv.data
    assert b"Join Now" in rv.data


def test_enquiry_page_loads(client):
    rv = client.get("/enquiry")
    assert rv.status_code == 200
    assert b"Enquiry" in rv.data


def test_enquiry_valid_submission(app, client):
    rv = client.post("/enquiry", data={
        "name": "Bob Builder",
        "email": "bob@build.com",
        "phone": "9876543210",
        "message": "I want to lose weight",
        "csrf_token": ""
    }, follow_redirects=True)
    assert rv.status_code == 200
    assert b"Thanks" in rv.data or b"soon" in rv.data
    with app.app_context():
        lead = Lead.query.filter_by(email="bob@build.com").first()
        assert lead is not None
        assert lead.status == "new"


def test_enquiry_missing_name(client):
    rv = client.post("/enquiry", data={
        "name": "",
        "email": "noname@test.com",
        "phone": "9876543210",
        "csrf_token": ""
    }, follow_redirects=True)
    # Should stay on enquiry page with validation error
    assert b"Enquiry" in rv.data or b"required" in rv.data.lower()


def test_enquiry_invalid_email(client):
    rv = client.post("/enquiry", data={
        "name": "Bad Email",
        "email": "not-an-email",
        "phone": "9876543210",
        "csrf_token": ""
    }, follow_redirects=True)
    assert b"Enquiry" in rv.data


# ── Admin lead dashboard ───────────────────────────────────────────────────────

def test_admin_leads_requires_auth(client):
    rv = client.get("/admin/leads", follow_redirects=False)
    assert rv.status_code in (302, 308)


def test_admin_leads_accessible_to_admin(app, client):
    _make_admin(app)
    _login_admin(client)
    rv = client.get("/admin/leads")
    assert rv.status_code == 200
    assert b"Leads" in rv.data


def test_admin_dashboard_shows_kpis(app, client):
    _make_admin(app)
    _login_admin(client)
    rv = client.get("/admin/dashboard")
    assert rv.status_code == 200
    assert b"Total Leads" in rv.data


def test_admin_lead_status_update(app, client):
    _make_admin(app)
    _login_admin(client)
    # Create a lead first
    with app.app_context():
        lead = Lead(name="Test", email="t@t.com", phone="9999",
                    status="new", source="website")
        db.session.add(lead)
        db.session.commit()
        lid = lead.id

    rv = client.post(f"/admin/leads/{lid}/status",
                     data={"status": "contacted", "csrf_token": ""},
                     follow_redirects=True)
    assert rv.status_code == 200
    with app.app_context():
        updated = db.session.get(Lead, lid)
        assert updated.status == "contacted"


def test_admin_lead_invalid_status_rejected(app, client):
    _make_admin(app)
    _login_admin(client)
    with app.app_context():
        lead = Lead(name="X", email="x@x.com", phone="1234",
                    status="new", source="website")
        db.session.add(lead)
        db.session.commit()
        lid = lead.id

    rv = client.post(f"/admin/leads/{lid}/status",
                     data={"status": "hacked", "csrf_token": ""},
                     follow_redirects=True)
    assert rv.status_code == 400
