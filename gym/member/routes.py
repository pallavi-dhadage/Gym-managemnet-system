from flask import render_template
from flask_login import login_required
from gym.member import member_bp


@member_bp.route("/dashboard")
@login_required
def dashboard():
    return render_template("member/dashboard.html")
