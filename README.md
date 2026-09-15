# Membership Journey

A professional membership management system for lead capture, plan selection, payment verification, and renewal tracking.

## Key Features

- Landing page with enquiry form
- Plan-based registration flow
- JWT authentication
- Membership status tracking: `PENDING`, `ACTIVE`, `EXPIRED`
- Admin dashboard for lead and payment management
- UPI payment flow with UTR verification
- Daily cron-based renewal reminders
- Trainer updates for diet and workout plans
- Responsive UI with Bootstrap and custom styling

## Tech Stack

- **Frontend:** HTML (Jinja), Bootstrap, CSS, Font Awesome, Google Fonts
- **Backend:** Flask
- **Database:** SQLite / MySQL / PostgreSQL

## Project Flow

```text
User Visits Website
        ↓
Submit Enquiry / Click Join Now
        ↓
Register Account
        ↓
JWT Generated
        ↓
Membership Status = PENDING
        ↓
Select / Update Plan
        ↓
Admin Generates UPI QR
        ↓
Member Pays & Submits UTR
        ↓
Admin Verifies Payment
        ↓
Membership Status = ACTIVE
        ↓
Daily Cron Job Checks Expiry
        ↓
Renewal Reminder Sent If Days Left <= 3
Folder Structure
bash


project-root/
│
├── app.py
├── requirements.txt
├── README.md
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── admin/
└── database/
Installation
bash


git clone <your-repo-url>
cd <project-folder>
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
Environment Variables
env


SECRET\_KEY=your\_secret\_key
DATABASE\_URL=your\_database\_url
SMTP\_USER=your\_email
SMTP\_PASSWORD=your\_email\_password
WHATSAPP\_API\_KEY=your\_whatsapp\_api\_key
Usage
Open the website
Submit an enquiry or register directly
Choose a membership plan
Complete UPI payment
Submit UTR for verification
Admin approves the membership
Receive renewal reminders before expiry
Admin Features
View and manage leads
Verify payment submissions
Approve or reject memberships
Track active and pending members
Manage renewal reminders
Member Features
Register and log in
View membership status
Update plan tier
Submit payment details
Receive renewal notifications
Access trainer updates
Screenshots
Add screenshots here if available.

Future Improvements
Automated payment gateway integration
SMS/Email notification system
Role-based access control
Analytics dashboard
Mobile app support
Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
