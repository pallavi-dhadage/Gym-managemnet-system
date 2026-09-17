from flask import Blueprint

public_bp = Blueprint("public", __name__)

from gym.public import routes  # noqa: E402, F401
