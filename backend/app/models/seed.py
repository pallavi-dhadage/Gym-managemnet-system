from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User
from app.models.member import MemberProfile
from app.models.plan import MembershipPlan
from app.models.payment import PaymentRecord
from app.models.subscription import Subscription
from app.models.operations import Trainer, Receptionist, Inquiry, Equipment, Product, Offer


def seed_database(db: Session):
    """Seed initial demo users, plans, equipment, products, and inquiries if database is empty."""
    if db.query(User).count() > 0:
        return

    # 1. Demo Users
    users_data = [
        {
            "email": "admin@gymforce.com",
            "password": "Admin@123",
            "full_name": "Admin User",
            "role": "master_admin",
            "phone": "+91 98765 00001",
            "avatar_url": "AU",
            "gym": "GymForce HQ",
        },
        {
            "email": "trainer@gymforce.com",
            "password": "Trainer@123",
            "full_name": "Rohit Kumar",
            "role": "trainer",
            "phone": "+91 98765 00002",
            "avatar_url": "RK",
            "gym": "GymForce HQ",
        },
        {
            "email": "staff@gymforce.com",
            "password": "Staff@123",
            "full_name": "Sarah Staff",
            "role": "staff",
            "phone": "+91 98765 00003",
            "avatar_url": "SS",
            "gym": "GymForce HQ",
        },
        {
            "email": "receptionist@gymforce.com",
            "password": "Recept@123",
            "full_name": "Rachel Front",
            "role": "receptionist",
            "phone": "+91 98765 00004",
            "avatar_url": "RF",
            "gym": "GymForce HQ",
        },
        {
            "email": "member@gymforce.com",
            "password": "Member@123",
            "full_name": "Priya Sharma",
            "role": "member",
            "phone": "+91 98765 43210",
            "avatar_url": "PS",
            "gym": "GymForce HQ",
        },
    ]

    created_users = {}
    for u in users_data:
        user = User(
            email=u["email"],
            hashed_password=get_password_hash(u["password"]),
            full_name=u["full_name"],
            role=u["role"],
            phone=u["phone"],
            avatar_url=u["avatar_url"],
            gym=u["gym"],
        )
        db.add(user)
        db.flush()
        created_users[u["email"]] = user

    # 2. Member Profile for Priya Sharma
    priya = created_users["member@gymforce.com"]
    member_profile = MemberProfile(
        user_id=priya.id,
        member_id="M-001",
        gender="female",
        category="Ladies",
        date_of_birth=date(1996, 5, 20),
        address="Indiranagar, Bangalore",
        emergency_contact="+91 98765 99999",
        join_date=date(2025, 1, 15),
        status="active",
        height="5'4\"",
        weight="61 kg",
        bmi="23.4",
        goal="weight_loss",
        diet_plan="High Protein / Low Carb",
        notes="Active member training with Rohit Kumar",
    )
    db.add(member_profile)
    db.flush()

    # 3. Trainer Profile for Rohit Kumar
    rohit = created_users["trainer@gymforce.com"]
    trainer = Trainer(
        user_id=rohit.id,
        specialization="Strength & Conditioning, Functional Fitness",
        bio="Certified ACE Trainer with 6+ years experience in personal coaching.",
        experience_years=6,
        rating=4.9,
    )
    db.add(trainer)

    # 4. Receptionist Profile
    rachel = created_users["receptionist@gymforce.com"]
    receptionist = Receptionist(
        user_id=rachel.id,
        shift_timing="Morning (6:00 AM - 2:00 PM)",
    )
    db.add(receptionist)
    db.flush()

    # 5. Membership Plans
    plans_data = [
        {"name": "Basic", "category": "Mens", "duration_days": 30, "price": 699.0, "popular": False, "description": "Gym floor access + standard locker"},
        {"name": "Standard", "category": "Mens", "duration_days": 30, "price": 1299.0, "popular": False, "description": "Gym access + group fitness classes"},
        {"name": "Premium", "category": "Mens", "duration_days": 30, "price": 1999.0, "popular": True, "description": "Full access + 2 PT sessions/mo + sauna"},
        {"name": "VIP", "category": "Mens", "duration_days": 30, "price": 3499.0, "popular": False, "description": "Unlimited everything + dedicated trainer"},
        {"name": "Basic", "category": "Ladies", "duration_days": 30, "price": 799.0, "popular": False, "description": "Gym access + ladies exclusive timings"},
        {"name": "Standard", "category": "Ladies", "duration_days": 30, "price": 1499.0, "popular": False, "description": "Gym + Zumba, Yoga & Aerobics classes"},
        {"name": "Premium", "category": "Ladies", "duration_days": 30, "price": 2299.0, "popular": True, "description": "Full access + Diet consultation + Spa"},
        {"name": "VIP", "category": "Ladies", "duration_days": 30, "price": 3999.0, "popular": False, "description": "All-inclusive VIP + Personal Trainer"},
    ]
    created_plans = []
    for p in plans_data:
        plan = MembershipPlan(**p)
        db.add(plan)
        db.flush()
        created_plans.append(plan)

    # 6. Priya's Subscription & Payment
    premium_ladies = next((p for p in created_plans if p.name == "Premium" and p.category == "Ladies"), created_plans[0])
    sub = Subscription(
        member_id=member_profile.id,
        plan_id=premium_ladies.id,
        start_date=date.today() - timedelta(days=10),
        end_date=date.today() + timedelta(days=26),
        status="active",
    )
    db.add(sub)

    payment = PaymentRecord(
        user_id=priya.id,
        plan_id=premium_ladies.id,
        amount=premium_ladies.price,
        transaction_reference="UPI-GF-20260801-098",
        payment_method="UPI",
        status="verified",
    )
    db.add(payment)

    # 7. Initial Equipment
    equipment_data = [
        {"name": "Commercial Treadmill X1", "category": "Cardio", "qty": 8, "condition": "Good", "last_maintenance": date(2026, 7, 10), "next_maintenance": date(2026, 9, 10), "status": "Available", "location": "Cardio Zone"},
        {"name": "Olympic Power Rack", "category": "Strength", "qty": 4, "condition": "Good", "last_maintenance": date(2026, 6, 15), "next_maintenance": date(2026, 9, 15), "status": "Available", "location": "Free Weights Area"},
        {"name": "Dumbbell Set (2.5 - 50 kg)", "category": "Free Weights", "qty": 2, "condition": "Good", "last_maintenance": date(2026, 5, 20), "next_maintenance": date(2026, 11, 20), "status": "Available", "location": "Free Weights Area"},
        {"name": "Air Rowing Machine", "category": "Cardio", "qty": 4, "condition": "Fair", "last_maintenance": date(2026, 7, 1), "next_maintenance": date(2026, 8, 30), "status": "Available", "location": "Cardio Zone"},
        {"name": "Leg Press 45 Degree", "category": "Strength", "qty": 2, "condition": "Needs Repair", "last_maintenance": date(2026, 4, 12), "next_maintenance": date(2026, 8, 25), "status": "Under Maintenance", "location": "Machine Zone"},
    ]
    for eq in equipment_data:
        db.add(Equipment(**eq))

    # 8. Initial Products
    products_data = [
        {"name": "Whey Protein Isolate (2 kg)", "category": "Supplements", "price": 3899.0, "stock": 24, "sku": "WPI-2000", "emoji": "🥛", "description": "Pure whey isolate 27g protein per scoop"},
        {"name": "Creatine Monohydrate (250 g)", "category": "Supplements", "price": 899.0, "stock": 40, "sku": "CRE-250", "emoji": "⚡", "description": "100% micronized creatine for explosive power"},
        {"name": "GymForce Shaker Bottle (700 ml)", "category": "Accessories", "price": 349.0, "stock": 50, "sku": "SHK-700", "emoji": "🥤", "description": "BPA-free leakproof shaker with stainless steel ball"},
        {"name": "Heavy Duty Lifting Straps", "category": "Equipment", "price": 499.0, "stock": 18, "sku": "STP-HD", "emoji": "🧤", "description": "Cotton padded wrist straps for deadlifts and pull exercises"},
        {"name": "GymForce Performance T-Shirt", "category": "Apparel", "price": 799.0, "stock": 35, "sku": "TSH-M", "emoji": "👕", "description": "Breathable quick-dry athletic performance fabric"},
    ]
    for pr in products_data:
        db.add(Product(**pr))

    # 9. Initial Offers
    offers_data = [
        {"title": "New Year Kickstart 20%", "code": "FIT2026", "category": "Membership", "discount_type": "Percentage", "discount_value": 20.0, "start_date": date(2026, 1, 1), "end_date": date(2026, 12, 31), "max_uses": 500, "used_count": 84, "description": "Get 20% off on all annual membership plans"},
        {"title": "Referral Bonus ₹500", "code": "REFER500", "category": "Referral", "discount_type": "Fixed Amount", "discount_value": 500.0, "start_date": date(2026, 1, 1), "end_date": date(2026, 12, 31), "max_uses": 1000, "used_count": 142, "description": "Flat ₹500 discount for friends referred by active members"},
        {"title": "Supplements Deal 15%", "code": "SUPP15", "category": "Product", "discount_type": "Percentage", "discount_value": 15.0, "start_date": date(2026, 6, 1), "end_date": date(2026, 9, 30), "max_uses": 200, "used_count": 38, "description": "15% off on all protein and supplement store purchases"},
    ]
    for of in offers_data:
        db.add(Offer(**of))

    # 10. Initial Inquiries
    inquiries_data = [
        {"name": "Tanvi Rao", "email": "tanvi@example.com", "phone": "+91 99001 11002", "interest": "Ladies Membership Plans", "message": "Interested in the Premium Ladies plan. What are the Zumba timings?", "status": "open", "via": "chat"},
        {"name": "Amit Joshi", "email": "amit@example.com", "phone": "+91 88002 22003", "interest": "Personal Training", "message": "Looking for a personal trainer specialising in weight loss.", "status": "responded", "response": "Hi Amit! Rohit Kumar specialises in weight management. Shall we book a free trial?", "via": "form", "follow_up": date.today() + timedelta(days=2), "follow_up_note": "Check if trial session is confirmed"},
        {"name": "Rajesh Nair", "email": "rajesh@example.com", "phone": "+91 77003 33004", "interest": "Corporate Package", "message": "We have 25 employees interested in corporate packages.", "status": "follow_up_due", "response": "Sent corporate brochure via email.", "via": "walk-in", "follow_up": date.today(), "follow_up_note": "Call Rajesh regarding corporate deal"},
    ]
    for inq in inquiries_data:
        db.add(Inquiry(**inq))

    db.commit()
