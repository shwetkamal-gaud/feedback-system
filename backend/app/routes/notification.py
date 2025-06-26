from fastapi import APIRouter, Depends, HTTPException
from app.schema import NotificationOut
from app.models.models import User, Notification
from sqlalchemy.orm import Session
from app.utils.auth import  get_db, get_current_user
from typing import cast
router = APIRouter(tags=["Notification"])

@router.get("/notifications", response_model=list[NotificationOut])
def get_notifications(user: User = Depends(get_current_user),
                      db: Session = Depends(get_db)):
    return db.query(Notification).filter_by(user_id=user.id).order_by(Notification.created_at.desc()).all()

@router.patch("/notifications/{notif_id}")
def mark_notification_read(notif_id: int,
                           user: User = Depends(get_current_user),
                           db: Session = Depends(get_db)):
    notif = db.query(Notification).filter_by(id=notif_id, user_id=user.id).first()
    if not notif:
        raise HTTPException(404, detail="Notification not found")
    notif.is_read = cast(bool, True) #ts:ignore
    db.commit()
    return {"message": "Notification marked as read"}
