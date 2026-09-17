from flask import render_template
from gym.public import public_bp


@public_bp.route("/")
def index():
    return render_template("public/index.html")


@public_bp.route("/enquiry", methods=["GET", "POST"])
def enquiry():
    return render_template("public/enquiry.html")
