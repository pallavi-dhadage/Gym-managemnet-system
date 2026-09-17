from flask import Blueprint

member_bp = Blueprint("member", __name__)

from gym.member import routes  # noqa: E402, F401
