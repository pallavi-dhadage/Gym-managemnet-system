import logging
from urllib.parse import urlparse, urljoin

import bcrypt
from flask import render_template, redirect, url_for, flash, request, current_app
from flask_login import login_user, logout_user, current_user, login_required

from gym.auth import auth_bp
from gym.auth.forms import LoginForm, RegistrationForm
from gym.extensions import db, limiter
from gym.models.user import User

audit = logging.getLogger("audit")


# ── Helpers ────────────────────────────────────────────────────────────────────

def _safe_redirect(target: str | None, fallback: str) -> str:
    """Return target only if it is a relative URL (prevents open-redirect)."""
    if not target:
        return fallback
    parsed = urlparse(urljoin(request.host_url, target))
    if parsed.netloc != urlparse(request.host_url).netloc:
        return fallback
    return target


def _hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def _check_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def _dashboard_for(user: User) -> str:
    routes = {"admin": "admin.dashboard", "trainer": "trainer.dashboard"}
    return routes.get(user.role, "member.dashboard")


# ── Register ───────────────────────────────────────────────────────────────────

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for(_dashboard_for(current_user)))

    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(
            name          = form.name.data.strip(),
            email         = form.email.data.lower().strip(),
            phone         = form.phone.data.strip(),
            password_hash = _hash_password(form.password.data),
            role          = "member",
        )
        db.session.add(user)
        db.session.commit()
        audit.info("REGISTER user_id=%s email=%s ip=%s",
                   user.id, user.email, request.remote_addr)
        flash("Account created! Please log in.", "success")
        return redirect(url_for("auth.login"))

    return render_template("auth/register.html", form=form)


# ── Login ──────────────────────────────────────────────────────────────────────

@auth_bp.route("/login", methods=["GET", "POST"])
@limiter.limit("10 per minute", error_message="Too many login attempts. Try again later.")
def login():
    if current_user.is_authenticated:
        return redirect(url_for(_dashboard_for(current_user)))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data.lower().strip()).first()

        # Constant-time comparison even if user not found (prevent user enumeration)
        dummy_hash = "$2b$12$invalidhashforcomparisonpurposes000000000000000000000000"
        stored_hash = user.password_hash if user else dummy_hash

        if user and _check_password(form.password.data, stored_hash) and user.is_active:
            login_user(user, remember=form.remember.data)
            audit.info("LOGIN_SUCCESS user_id=%s email=%s ip=%s",
                       user.id, user.email, request.remote_addr)
            next_url = _safe_redirect(request.args.get("next"),
                                      url_for(_dashboard_for(user)))
            flash(f"Welcome back, {user.name}!", "success")
            return redirect(next_url)

        # Generic error — don't reveal whether email or password was wrong
        audit.warning("LOGIN_FAIL email=%s ip=%s", form.email.data, request.remote_addr)
        flash("Invalid email or password.", "danger")

    return render_template("auth/login.html", form=form)


# ── Logout ─────────────────────────────────────────────────────────────────────

@auth_bp.route("/logout")
@login_required
def logout():
    audit.info("LOGOUT user_id=%s email=%s ip=%s",
               current_user.id, current_user.email, request.remote_addr)
    logout_user()
    flash("You have been logged out.", "info")
    return redirect(url_for("public.index"))
