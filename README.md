Gym Management System

A modern, role-based Gym Management System designed to streamline
gym operations, member management, trainer activities, payments, and
fitness tracking through a centralized web application.

Key Features

Role-Based Access --- Master Admin, Trainer, Staff,
Receptionist, and Member dashboards.

Member Management --- Registration, profiles, membership status,
and approvals.

Enquiry Management --- Track and manage prospective member
enquiries.

Trainer Management --- Assign trainers, manage sessions, and
track member progress.

Workout & Diet Plans --- Manage personalized fitness and diet
recommendations.

Payment Management --- Track memberships, payments, and renewal
status.

Authentication & Security --- Secure login, session handling,
password hashing, and role-based authorization.

Reports & Dashboard --- Centralized operational insights and
quick actions.

Technology Stack

Frontend: React, JavaScript, HTML5, CSS3, Tailwind CSS
Backend: Python, Flask, REST APIs
Database: SQLite / SQL-based database
Security: Argon2 password hashing, role-based authorization
Tools: Git, GitHub, VS Code

System Workflow

User Login
    ↓
Role Verification
    ↓
Role-Based Dashboard
    ↓
Manage Members / Trainers / Enquiries / Payments
    ↓
Workout & Diet Tracking
    ↓
Reports & Operational Insights

Project Structure

Gym-management-system/
├── backend/        # Flask backend, APIs, authentication
├── frontend/       # React frontend and UI
├── .vscode/
├── .gitignore
├── LICENSE
└── README.md

Getting Started

1. Clone the repository

git clone <repository-url>
cd Gym-management-system

2. Run the backend

cd backend
# Create and activate a virtual environment
# Install dependencies
pip install -r requirements.txt
# Start the Flask server

3. Run the frontend

cd frontend
npm install
npm run dev

Project Goal

To provide a secure, scalable, and user-friendly platform that
reduces manual gym administration and improves member, trainer, and
business operations.

License

This project is licensed under the terms specified in the LICENSE
file.
