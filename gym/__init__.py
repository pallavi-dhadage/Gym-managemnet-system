import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, render_template

from config import config
from gym.extensions import db, migrate, csrf, login_manager, limiter, mail


def create_app(config_name: str | None = None) -> Flask:
    """Application factory."""
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "default")

    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.config.from_object(config[config_name])

    # ── Extensions ─────────────────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    csrf.init_app(app)
    limiter.init_app(app)
    mail.init_app(app)

    login_manager.init_app(app)
    login_manager.login_view      = "auth.login"
    login_manager.login_message   = "Please log in to access this page."
    login_manager.login_message_category = "warning"

    # ── Models (import all so SQLAlchemy / Flask-Migrate sees every table) ──────
    import gym.models  # noqa: F401  — triggers gym/models/__init__.py
    from gym.models.user import User  # needed by user_loader below

    # ── Flask-Login user_loader ─────────────────────────────────────────────────
    @login_manager.user_loader
    def load_user(user_id: str):
        return db.session.get(User, int(user_id))

    # ── Blueprints ──────────────────────────────────────────────────────────────
    from gym.public.routes  import public_bp
    from gym.auth.routes    import auth_bp
    from gym.member.routes  import member_bp
    from gym.admin.routes   import admin_bp
    from gym.trainer.routes import trainer_bp

    app.register_blueprint(public_bp)
    app.register_blueprint(auth_bp,    url_prefix="/auth")
    app.register_blueprint(member_bp,  url_prefix="/member")
    app.register_blueprint(admin_bp,   url_prefix="/admin")
    app.register_blueprint(trainer_bp, url_prefix="/trainer")

    # ── Error Handlers ─────────────────────────────────────────────────────────
    @app.errorhandler(400)
    def bad_request(e):
        return render_template("errors/400.html"), 400

    @app.errorhandler(403)
    def forbidden(e):
        return render_template("errors/403.html"), 403

    @app.errorhandler(404)
    def not_found(e):
        return render_template("errors/404.html"), 404

    @app.errorhandler(429)
    def too_many_requests(e):
        return render_template("errors/429.html"), 429

    @app.errorhandler(500)
    def internal_error(e):
        db.session.rollback()
        return render_template("errors/500.html"), 500

    # ── Logging ────────────────────────────────────────────────────────────────
    _configure_logging(app)

    return app


def _configure_logging(app: Flask) -> None:
    logs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs")
    os.makedirs(logs_dir, exist_ok=True)

    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
    )

    # App log
    file_handler = RotatingFileHandler(
        os.path.join(logs_dir, "app.log"),
        maxBytes=1_000_000, backupCount=5
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.INFO)

    # Audit log (security events)
    audit_handler = RotatingFileHandler(
        os.path.join(logs_dir, "audit.log"),
        maxBytes=1_000_000, backupCount=10
    )
    audit_handler.setFormatter(formatter)
    audit_handler.setLevel(logging.INFO)

    audit_logger = logging.getLogger("audit")
    audit_logger.setLevel(logging.INFO)
    audit_logger.addHandler(audit_handler)
    audit_logger.propagate = False

    if not app.debug and not app.testing:
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info("GymForce application startup")
