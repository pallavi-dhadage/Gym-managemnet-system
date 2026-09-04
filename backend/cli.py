import sys
from datetime import date, timedelta
from app.database import SessionLocal, Base, engine
from app.models.subscription import Subscription
from app.models.seed import seed_database


def scan_expiring_subscriptions(days_ahead: int = 3):
    """Scan and list subscriptions expiring in the next specified days."""
    db = SessionLocal()
    try:
        target_date = date.today() + timedelta(days=days_ahead)
        expiring = (
            db.query(Subscription)
            .filter(Subscription.end_date == target_date, Subscription.status == "active")
            .all()
        )
        print(f"🔍 Scanning subscriptions expiring on {target_date} ({days_ahead} days from today)...")
        print(f"📊 Found {len(expiring)} subscription(s) expiring on {target_date}.")
        for sub in expiring:
            user = sub.member.user if sub.member else None
            member_name = user.full_name if user else "Unknown"
            email = user.email if user else "No Email"
            phone = user.phone if user else "No Phone"
            print(f"  • Member: {member_name} ({sub.member.member_id}) | Plan: {sub.plan.name if sub.plan else 'N/A'} | Email: {email} | Phone: {phone}")
    finally:
        db.close()


def seed():
    """Manually seed database tables and demo data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        print("✅ Database successfully seeded with demo accounts, plans, equipment, and offers.")
    finally:
        db.close()


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or args[0] == "help":
        print("GymForce CLI Commands:")
        print("  python cli.py seed              - Seed initial database data")
        print("  python cli.py scan-expiring [N] - Scan subscriptions expiring in N days (default 3)")
    elif args[0] == "seed":
        seed()
    elif args[0] == "scan-expiring":
        days = int(args[1]) if len(args) > 1 else 3
        scan_expiring_subscriptions(days)
    else:
        print(f"Unknown command '{args[0]}'. Run 'python cli.py help' for usage.")
