def test_homepage_loads(client):
    """Public landing page returns 200."""
    rv = client.get("/")
    assert rv.status_code == 200


def test_404_returns_error_page(client):
    """Unknown route returns 404."""
    rv = client.get("/nonexistent-route-xyz")
    assert rv.status_code == 404


def test_login_page_loads(client):
    """Login page returns 200."""
    rv = client.get("/auth/login")
    assert rv.status_code == 200


def test_member_dashboard_redirects_unauthenticated(client):
    """Member dashboard redirects unauthenticated users to login."""
    rv = client.get("/member/dashboard", follow_redirects=False)
    assert rv.status_code in (302, 308)
