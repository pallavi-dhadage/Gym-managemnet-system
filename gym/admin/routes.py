import logging
from flask import render_template, redirect, url_for, flash, request, abort
from flask_login import current_user
from gym.admin import admin_bp
from gym.extensions import db
from gym.models.lead import Lead
from gym.models.user import User
from gym.models.membership import Membership, Plan
from gym.utils.decorators import admin_required

audit = logging.getLogger("audit")

VALID_LEAD_STATUSES = {"new", "contacted", "converted", "closed"}


@admin_bp.route("/dashboard")
@admin_required
def dashboard():
    total_leads     = Lead.query.count()
    new_leads       = Lead.query.filter_by(status="new").count()
    pending_members = Membership.query.filter_by(status="PENDING").count()
    active_members  = Membership.query.filter_by(status="ACTIVE").count()
    return render_template("admin/dashboard.html",
                           total_leads=total_leads,
                           new_leads=new_leads,
                           pending_members=pending_members,
                           active_members=active_members)


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


# ── Members List ───────────────────────────────────────────────────────────────

@admin_bp.route("/members")
@admin_required
def members():
    status_filter = request.args.get("status", "")
    query = (db.session.query(User, Membership)
             .outerjoin(Membership, (Membership.user_id == User.id))
             .filter(User.role == "member")
             .order_by(User.created_at.desc()))

    if status_filter in ("PENDING", "ACTIVE", "EXPIRED", "CANCELLED"):
        query = query.filter(Membership.status == status_filter)

    rows = query.all()
    pending_count = Membership.query.filter_by(status="PENDING").count()
    active_count  = Membership.query.filter_by(status="ACTIVE").count()

    return render_template("admin/members.html",
                           rows=rows,
                           status_filter=status_filter,
                           pending_count=pending_count,
                           active_count=active_count)


# ── Activate Membership (manual admin override) ────────────────────────────────

@admin_bp.route("/members/<int:membership_id>/activate", methods=["POST"])
@admin_required
def activate_membership(membership_id):
    from datetime import date
    membership = db.session.get(Membership, membership_id)
    if not membership:
        abort(404)
    if membership.status not in ("PENDING",):
        flash("Only PENDING memberships can be manually activated.", "warning")
        return redirect(url_for("admin.members"))

    membership.status     = "ACTIVE"
    membership.start_date = date.today()
    from datetime import timedelta
    membership.end_date   = date.today() + timedelta(days=membership.plan.duration_days)
    db.session.commit()

    audit.info("MEMBERSHIP_ACTIVATED membership_id=%s user_id=%s admin=%s",
               membership_id, membership.user_id, current_user.id)
    flash(f"Membership #{membership_id} activated successfully.", "success")
    return redirect(url_for("admin.members"))


# ── Dashboard (updated KPIs) ──────────────────────────────────────────────────

@admin_bp.route("/dashboard/stats")
@admin_required
def dashboard_stats():
    """JSON-style stats for future AJAX refresh — used internally."""
    return {
        "total_leads":   Lead.query.count(),
        "new_leads":     Lead.query.filter_by(status="new").count(),
        "pending_members": Membership.query.filter_by(status="PENDING").count(),
        "active_members":  Membership.query.filter_by(status="ACTIVE").count(),
    }
