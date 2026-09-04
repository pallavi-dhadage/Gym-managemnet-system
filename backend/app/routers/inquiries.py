from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.operations import Inquiry
from app.schemas.operations import InquiryCreate, InquiryRespond, InquiryResponse
from app.core.dependencies import get_current_staff

router = APIRouter(prefix="/inquiries", tags=["Inquiries & Leads"])


@router.post("", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_inquiry(data: InquiryCreate, db: Session = Depends(get_db)):
    """Public endpoint for prospective gym members to submit an enquiry or chat message."""
    inquiry = Inquiry(
        name=data.name.strip(),
        email=data.email.strip() if data.email else "",
        phone=data.phone.strip(),
        interest=data.interest or "General",
        message=data.message or "",
        via=data.via or "form",
        status="open",
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.get("", response_model=List[InquiryResponse])
def list_inquiries(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """List all prospective member inquiries (Staff / Receptionist only)."""
    query = db.query(Inquiry)
    if status_filter:
        query = query.filter(Inquiry.status == status_filter)
    return query.order_by(Inquiry.created_at.desc()).all()


@router.put("/{inquiry_id}/respond", response_model=InquiryResponse)
def respond_to_inquiry(
    inquiry_id: str,
    data: InquiryRespond,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Record response to an enquiry and schedule follow-ups."""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")

    inquiry.response = data.response
    inquiry.status = data.status or "responded"
    if data.follow_up:
        inquiry.follow_up = data.follow_up
    if data.follow_up_note:
        inquiry.follow_up_note = data.follow_up_note

    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.post("/{inquiry_id}/convert", response_model=InquiryResponse)
def convert_inquiry(
    inquiry_id: str,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Mark an inquiry as successfully converted into a paid gym member."""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")

    inquiry.converted_to_member = True
    inquiry.status = "converted"
    db.commit()
    db.refresh(inquiry)
    return inquiry
