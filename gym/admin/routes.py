import logging
from flask import render_template, redirect, url_for, flash, request, abort
from flask_login import current_user
from gym.admin import admin_bp
from gym.extensions import db
from gym.models.lead import Lead
from gym.utils.decorators import admin_required

audit = logging.getLogger("audit")

VALID_LEAD_STATUSES = {"new", "contacted", "converted", "closed"}


@admin_bp.route("/dashboard")
@admin_required
def dashboard():
    total_leads   = Lead.query.count()
    new_leads     = Lead.query.filter_by(status="new").count()
    return render_template("admin/dashboard.html",
                           total_leads=total_leads,
                           new_leads=new_leads)


@admin_bp.route("/leads")
@admin_required
def leads():
    status_filter = request.args.get("status", "")
    query = Lead.query.order_by(Lead.created_at.desc())
    if status_filter in VALID_LEAD_STATUSES:
        query = query.filter_by(status=status_filter)
    leads_list = query.all()
    return render_template("admin/leads.html",
                           leads=leads_list,
                           status_filter=status_filter,
                           valid_statuses=VALID_LEAD_STATUSES)


@admin_bp.route("/leads/<int:lead_id>/status", methods=["POST"])
@admin_required
def update_lead_status(lead_id):
    lead = db.session.get(Lead, lead_id)
    if lead is None:
        abort(404)
    new_status = request.form.get("status", "").strip()

    if new_status not in VALID_LEAD_STATUSES:
        abort(400)

    old_status = lead.status
    lead.status = new_status
    db.session.commit()

    audit.info("LEAD_STATUS_CHANGE lead_id=%s %s->%s admin=%s ip=%s",
               lead_id, old_status, new_status,
               current_user.id, request.remote_addr)
    flash(f"Lead #{lead_id} status updated to '{new_status}'.", "success")
    return redirect(url_for("admin.leads"))
