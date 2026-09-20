"""
gym/utils/decorators.py
Role-based access control decorators.
Usage:
    @admin_required
    @trainer_required
    @member_required
"""
from functools import wraps
from flask import abort
from flask_login import current_user, login_required


def _role_required(*roles):
    """Factory: returns a decorator that enforces one of the given roles."""
    def decorator(f):
        @wraps(f)
        @login_required          # ensures user is authenticated first
        def decorated_function(*args, **kwargs):
            if current_user.role not in roles:
                abort(403)
            return f(*args, **kwargs)
        return decorated_function
    return decorator


# Convenience decorators
admin_required   = _role_required("admin")
trainer_required = _role_required("trainer", "admin")   # admins can do trainer actions too
member_required  = _role_required("member", "trainer", "admin")
