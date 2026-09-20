from datetime import datetime
from gym.extensions import db


class TrainerNote(db.Model):
    """Diet / workout / training notes written by a trainer for a member."""
    __tablename__ = "trainer_notes"

    id         = db.Column(db.Integer, primary_key=True)
    member_id  = db.Column(db.Integer, db.ForeignKey("users.id",
                           ondelete="CASCADE"), nullable=False, index=True)
    trainer_id = db.Column(db.Integer, db.ForeignKey("users.id",
                           ondelete="SET NULL"), nullable=True,  index=True)

    # note_type: diet | workout | training | general
    note_type  = db.Column(db.String(20), nullable=False, default="general")
    content    = db.Column(db.Text,       nullable=False)
    is_visible = db.Column(db.Boolean,    default=True, nullable=False)

    created_at = db.Column(db.DateTime,   default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime,   default=datetime.utcnow,
                           onupdate=datetime.utcnow, nullable=False)

    # Relationships
    member  = db.relationship("User", foreign_keys=[member_id],
                              back_populates="notes_received")
    trainer = db.relationship("User", foreign_keys=[trainer_id],
                              back_populates="notes_written")

    def __repr__(self):
        return f"<TrainerNote [{self.note_type}] member={self.member_id}>"
