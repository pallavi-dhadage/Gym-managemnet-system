import logging
from flask import render_template, redirect, url_for, flash, request
from gym.public import public_bp
from gym.public.forms import EnquiryForm
from gym.extensions import db
from gym.models.lead import Lead

audit = logging.getLogger("audit")


@public_bp.route("/")
def index():
    form = EnquiryForm()
    return render_template("public/index.html", form=form)


@public_bp.route("/enquiry", methods=["GET", "POST"])
def enquiry():
    form = EnquiryForm()
    if form.validate_on_submit():
        lead = Lead(
            name    = form.name.data.strip(),
            email   = form.email.data.lower().strip(),
            phone   = form.phone.data.strip(),
            message = (form.message.data or "").strip(),
            source  = "website",
            status  = "new",
        )
        db.session.add(lead)
        db.session.commit()
        audit.info("LEAD_CREATED lead_id=%s email=%s ip=%s",
                   lead.id, lead.email, request.remote_addr)
        flash("Thanks! We will get in touch with you soon.", "success")
        return redirect(url_for("public.index"))

    return render_template("public/enquiry.html", form=form)
