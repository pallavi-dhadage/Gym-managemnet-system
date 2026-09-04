# 🏋️ GymForce Backend (FastAPI)

Modern, high-performance REST API for GymForce Gym Management System built with **FastAPI**, **Pydantic v2**, and **SQLAlchemy 2.0**.

---

## ⚡ Quick Start

### 1. Set Up Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Or using `uv`:
```bash
uv pip install -r requirements.txt
```

### 2. Run the Server

```bash
python main.py
```
*(Or `uvicorn app.main:app --reload --port 8000`)*

The server will start at **`http://localhost:8000`**.

---

## 📖 API Documentation & Endpoints

| URL | Description |
|---|---|
| **`http://localhost:8000/api/docs`** | Interactive **Swagger UI** with OAuth2 test authentication |
| **`http://localhost:8000/api/redoc`** | ReDoc API documentation |
| **`http://localhost:8000/api/health`** | Health check status |

### Key API Modules

- 🔐 **Authentication (`/api/auth`)** — Registration, Login, Token exchange, Profile & Password management.
- 👥 **Members (`/api/members`)** — List, filter by category/status, member profiles, assign trainers.
- 💳 **Membership Plans (`/api/plans`)** — Tiered plans (Basic, Standard, Premium, VIP) by category (Ladies, Mens, Mixed).
- 💰 **Payments (`/api/payments`)** — Payment submissions, verification, automatic subscription generation.
- 📅 **Subscriptions & Trials (`/api/subscriptions`, `/api/subscriptions/trials`)** — Subscription records, 2-day free trial passes.
- 🕒 **Attendance (`/api/attendance`)** — Daily member check-in, zone distribution, history logs.
- 💬 **Inquiries (`/api/inquiries`)** — Lead capture form, chat bot messages, follow-up scheduling, conversion to member.
- 🏋️ **Operations (`/api/workouts`, `/api/equipment`, `/api/products`, `/api/offers`)** — Trainer workout/diet assignments, equipment maintenance tracking, gym store inventory, promotional coupons.
- 📊 **Dashboard (`/api/dashboard/summary`)** — Consolidated KPI summaries, revenue stats, active counts.

---

## 🛠️ Demo Seed Credentials

The database is automatically initialized on startup with demo accounts:

| Role | Email | Password |
|---|---|---|
| **Master Admin** | `admin@gymforce.com` | `Admin@123` |
| **Trainer** | `trainer@gymforce.com` | `Trainer@123` |
| **Staff** | `staff@gymforce.com` | `Staff@123` |
| **Receptionist** | `receptionist@gymforce.com` | `Recept@123` |
| **Gym Member** | `member@gymforce.com` | `Member@123` |

---

## 🔐 Security & Password Hashing

GymForce uses **Argon2id** (`argon2-cffi`) for all password hashing following OWASP recommendations:
- **Algorithm**: `Argon2id` (`Type.ID`)
- **Memory Cost**: `65,536 KiB` (64 MB)
- **Time Cost / Iterations**: `3`
- **Parallelism**: `4` threads
- **Authentication Credentials**: Accepts user **`email`** (case-insensitive) and **`password`**.

---

## 🧪 Running Tests

Run the test suite covering Argon2id hashing, authentication, and all API endpoints:

```bash
python test_api.py
```

---

## 💻 CLI Commands

```bash
# Scan subscriptions expiring in 3 days
python cli.py scan-expiring

# Re-seed database with default demo data
python cli.py seed
```

