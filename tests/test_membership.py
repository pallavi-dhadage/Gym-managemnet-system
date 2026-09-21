"""tests/test_membership.py — Membership module tests"""
import bcrypt
from gym.extensions import db
from gym.models.user import User
from gym.models.membership import Plan, Membership


# ── Helpers ────────────────────────────────────────────────────────────────────

def _seed_plans(app):
    with app.app_context():
        if Plan.query.count() == 0:
            db.session.add(Plan(name="Monthly",   price=999,  duration_days=30,  is_active=True))
            db.session.add(Plan(name="Quarterly", price=2499, duration_days=90,  is_active=True))
            db.session.add(Plan(name="Annual",    price=7999, duration_days=365, is_active=True))
            db.session.commit()


def _make_member(app, email="member@gym.com", password="Member123"):
    with app.app_context():
        u = User.query.filter_by(email=email).first()
        if u:
            return u
        pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        u = User(name="Test Member", email=email,
                 phone="9000000001", password_hash=pw, role="member")
        db.session.add(u)
        db.session.commit()
        return u


def _make_admin(app, email="admin2@gym.com"):
    with app.app_context():
        u = User.query.filter_by(email=email).first()
        if u:
            return u
        pw = bcrypt.hashpw(b"Admin1234", bcrypt.gensalt()).decode()
        u = User(name="Admin", email=email,
                 phone="9000000002", password_hash=pw, role="admin")
        db.session.add(u)
        db.session.commit()
        return u


def _login(client, email, password):
    return client.post("/auth/login", data={
        "email": email, "password": password, "csrf_token": ""
    }, follow_redirects=True)


# ── Member Dashboard ────────────────────────────────────────────────────────────

def test_member_dashboard_requires_login(client):
    rv = client.get("/member/dashboard", follow_redirects=False)
    assert rv.status_code in (302, 308)


def test_member_dashboard_loads(app, client):
    _make_member(app)
    _login(client, "member@gym.com", "Member123")
    rv = client.get("/member/dashboard")
    assert rv.status_code == 200
    assert b"Test Member" in rv.data


# ── Plans Page ─────────────────────────────────────────────────────────────────

def test_plans_page_loads(app, client):
    _seed_plans(app)
    _make_member(app)
    _login(client, "member@gym.com", "Member123")
    rv = client.get("/member/plans")
    assert rv.status_code == 200
    assert b"Monthly" in rv.data or b"Plan" in rv.data


def test_plan_selection_creates_pending_membership(app, client):
    _seed_plans(app)
    _make_member(app)
    _login(client, "member@gym.com", "Member123")

    with app.app_context():
        plan = Plan.query.filter_by(name="Monthly").first()
        plan_id = plan.id

    rv = client.post("/member/plans", data={
        "plan_id": plan_id, "csrf_token": ""
    }, follow_redirects=True)
    assert rv.status_code == 200

    with app.app_context():
        member = User.query.filter_by(email="member@gym.com").first()
        m = Membership.query.filter_by(user_id=member.id, status="PENDING").first()
        assert m is not None
        assert m.plan_id == plan_id


# ── Change Plan ────────────────────────────────────────────────────────────────

def test_change_plan_updates_pending_membership(app, client):
    _seed_plans(app)
    _make_member(app)
    _login(client, "member@gym.com", "Member123")

    with app.app_context():
        member = User.query.filter_by(email="member@gym.com").first()
        monthly = Plan.query.filter_by(name="Monthly").first()
        quarterly = Plan.query.filter_by(name="Quarterly").first()
        m = Membership(user_id=member.id, plan_id=monthly.id, status="PENDING")
        db.session.add(m)
        db.session.commit()
        quarterly_id = quarterly.id

    rv = client.post("/member/change-plan", data={
        "plan_id": quarterly_id, "csrf_token": ""
    }, follow_redirects=True)
    # Should redirect to payment page — Quarterly name or payment instructions visible
    assert rv.status_code == 200
    assert b"Quarterly" in rv.data or b"Payment" in rv.data or b"changed" in rv.data.lower()


# ── Admin Activate Membership ───────────────────────────────────────────────────

def test_admin_can_activate_membership(app, client):
    _seed_plans(app)
    _make_member(app, email="toacivate@gym.com")
    _make_admin(app)
    _login(client, "admin2@gym.com", "Admin1234")

    with app.app_context():
        member = User.query.filter_by(email="toacivate@gym.com").first()
        plan = Plan.query.first()
        m = Membership(user_id=member.id, plan_id=plan.id, status="PENDING")
        db.session.add(m)
        db.session.commit()
        mid = m.id

    rv = client.post(f"/admin/members/{mid}/activate",
                     data={"csrf_token": ""},
                     follow_redirects=True)
    assert rv.status_code == 200

    with app.app_context():
        activated = db.session.get(Membership, mid)
        assert activated.status == "ACTIVE"
        assert activated.start_date is not None
        assert activated.end_date is not None


def test_admin_members_page_loads(app, client):
    _seed_plans(app)
    _make_admin(app)
    _login(client, "admin2@gym.com", "Admin1234")
    rv = client.get("/admin/members")
    assert rv.status_code == 200
    assert b"Members" in rv.data
