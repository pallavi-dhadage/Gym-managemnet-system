```markdown
# Membership Journey

A professional membership management system for lead capture, plan selection, payment verification, and renewal tracking.

## ✨ Features

- Landing page with enquiry form
- Plan-based registration flow
- JWT authentication
- Membership status tracking: `PENDING`, `ACTIVE`, `EXPIRED`
- Admin dashboard for leads & payments
- UPI payment flow with UTR verification
- Daily cron-based renewal reminders
- Trainer updates for diet & workout plans
- Responsive UI with Bootstrap

## 🛠 Tech Stack

- **Frontend:** HTML (Jinja), Bootstrap, CSS, Font Awesome, Google Fonts
- **Backend:** Flask
- **Database:** SQLite / MySQL / PostgreSQL

## 🔄 Project Flow

```
User Visits Website → Submit Enquiry / Join Now → Register Account
→ JWT Generated → Status = PENDING → Select Plan → Admin Generates UPI QR
→ Member Pays & Submits UTR → Admin Verifies → Status = ACTIVE
→ Daily Cron Checks Expiry → Renewal Reminder (if days left ≤ 3)
```

## 📁 Folder Structure

```
project-root/
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
```

## 🚀 Installation

```bash
git clone <your-repo-url>
cd <project-folder>
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## 🔐 Environment Variables

```env
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
SMTP_USER=your_email
SMTP_PASSWORD=your_email_password
WHATSAPP_API_KEY=your_whatsapp_api_key
```

## 📖 Usage

1. Open the website
2. Submit an enquiry or register directly
3. Choose a membership plan
4. Complete UPI payment & submit UTR
5. Admin approves membership
6. Receive renewal reminders before expiry

## 👤 Admin Features

- Manage leads & payment submissions
- Approve/reject memberships
- Track active & pending members
- Manage renewal reminders

## 🧑 Member Features

- Register & log in
- View membership status
- Update plan tier
- Submit payment details
- Receive renewal notifications
- Access trainer updates

## 🔮 Future Improvements

- Automated payment gateway integration
- SMS/Email notification system
- Role-based access control
- Analytics dashboard
- Mobile app support

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.
