from flask import render_template
from flask_login import login_required
from gym.trainer import trainer_bp


@trainer_bp.route("/dashboard")
@login_required
def dashboard():
    return render_template("trainer/notes.html")
