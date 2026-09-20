"""tests/conftest.py — Pytest fixtures"""
import pytest
from gym import create_app
from gym.extensions import db as _db


@pytest.fixture(scope="session")
def app():
    """One app instance for the whole test session (in-memory SQLite)."""
    application = create_app("testing")
    with application.app_context():
        _db.create_all()
        yield application
        _db.drop_all()


@pytest.fixture(scope="function")
def client(app):
    """Fresh test client + DB rollback per test — full isolation."""
    with app.test_client() as c:
        with app.app_context():
            # Begin a nested transaction we can roll back after each test
            connection = _db.engine.connect()
            transaction = connection.begin()
            _db.session.bind = connection  # type: ignore[attr-defined]
            yield c
            _db.session.remove()
            transaction.rollback()
            connection.close()
