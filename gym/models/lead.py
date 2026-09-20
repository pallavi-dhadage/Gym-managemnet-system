from datetime import datetime
from gym.extensions import db


class Lead(db.Model):
    """Enquiry / lead captured from the landing page."""
    __tablename__ = "leads"

    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(120), nullable=False)
    email      = db.Column(db.String(120), nullable=False, index=True)
    phone      = db.Column(db.String(20),  nullable=False)
    message    = db.Column(db.Text,        nullable=True)
    # status: new | contacted | converted | closed
    status     = db.Column(db.String(20),  nullable=False, default="new")
    source     = db.Column(db.String(50),  nullable=True, default="website")
    created_at = db.Column(db.DateTime,    default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime,    default=datetime.utcnow,
                           onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Lead {self.name} [{self.status}]>"
