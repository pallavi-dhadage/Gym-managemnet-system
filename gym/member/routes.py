import logging
from flask import render_template, redirect, url_for, flash, abort
from flask_login import current_user

from gym.member import member_bp
from gym.member.forms import PlanSelectionForm
from gym.extensions import db
from gym.models.membership import Plan, Membership
from gym.utils.decorators import member_required

audit = logging.getLogger("audit")


# ── Dashboard ──────────────────────────────────────────────────────────────────

@member_bp.route("/dashboard")
@member_required
def dashboard():
    membership    = current_user.active_membership
    pending       = current_user.pending_membership
    plans         = Plan.query.filter_by(is_active=True).order_by(Plan.duration_days).all()
    notes         = (current_user.notes_received
                     .filter_by(is_visible=True)
                     .order_by(db.text("created_at DESC"))
                     .limit(5).all())
    return render_template("member/dashboard.html",
                           membership=membership,
                           pending=pending,
                           plans=plans,
                           notes=notes)


# ── Plan Selection ─────────────────────────────────────────────────────────────

@member_bp.route("/plans", methods=["GET", "POST"])
@member_required
def plans():
    """Show available plans and let the member choose one (creates PENDING membership)."""
    # Block if already ACTIVE
    if current_user.active_membership:
        flash("You already have an active membership.", "info")
        return redirect(url_for("member.dashboard"))

    form = PlanSelectionForm()
    if form.validate_on_submit():
        plan = db.session.get(Plan, form.plan_id.data)
        if not plan or not plan.is_active:
            abort(400)

        # Cancel any existing PENDING memberships before creating a new one
        (Membership.query
         .filter_by(user_id=current_user.id, status="PENDING")
         .update({"status": "CANCELLED"}))

        membership = Membership(
            user_id = current_user.id,
            plan_id = plan.id,
            status  = "PENDING",
        )
        db.session.add(membership)
        db.session.commit()

        audit.info("MEMBERSHIP_CREATED user_id=%s plan=%s membership_id=%s",
                   current_user.id, plan.name, membership.id)
        flash(f"Plan '{plan.name}' selected! Please complete payment to activate.", "success")
        return redirect(url_for("member.payment_info"))

    all_plans = Plan.query.filter_by(is_active=True).order_by(Plan.duration_days).all()
    return render_template("member/plans.html", form=form, plans=all_plans)


# ── Change Plan (PENDING only) ─────────────────────────────────────────────────

@member_bp.route("/change-plan", methods=["GET", "POST"])
@member_required
def change_plan():
    """Allow plan change only when membership is PENDING (not yet paid)."""
    pending = current_user.pending_membership
    if not pending:
        flash("You can only change your plan before payment is verified.", "warning")
        return redirect(url_for("member.dashboard"))

    form = PlanSelectionForm()
    if form.validate_on_submit():
        plan = db.session.get(Plan, form.plan_id.data)
        if not plan or not plan.is_active:
            abort(400)

        old_plan = pending.plan.name
        pending.plan_id = plan.id
        db.session.commit()

        audit.info("PLAN_CHANGED user_id=%s %s->%s membership_id=%s",
                   current_user.id, old_plan, plan.name, pending.id)
        flash(f"Plan changed to '{plan.name}'. Please complete payment.", "success")
        return redirect(url_for("member.payment_info"))

    all_plans = Plan.query.filter_by(is_active=True).order_by(Plan.duration_days).all()
    return render_template("member/plans.html", form=form, plans=all_plans,
                           change_mode=True, current_plan=pending.plan)


# ── Payment Info (stub — full payment in Module 5) ────────────────────────────

@member_bp.route("/payment")
@member_required
def payment_info():
    pending = current_user.pending_membership
    if not pending:
        flash("No pending membership found. Please select a plan first.", "warning")
        return redirect(url_for("member.plans"))
    return render_template("member/payment.html", membership=pending)
