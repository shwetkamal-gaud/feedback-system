from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import Feedback, User
from app.utils.auth import require_role, get_db, get_current_user
from app.schema import FeedbackCreate, FeedbackOut
from datetime import datetime, timezone

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("/", response_model=FeedbackOut)
def submit_feedback(data: FeedbackCreate,
                    db: Session = Depends(get_db),
                    manager:User  = Depends(require_role("manager"))):
    fb = Feedback(
        manager_id=manager.id,
        employee_id=data.employee_id,
        strengths=data.strengths,
        areas_to_improve=data.areas_to_improve,
        sentiment=data.sentiment,
        tags=",".join(data.tags),
        is_anonymous=data.is_anonymous,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb

@router.patch("/{feedback_id}", response_model=FeedbackOut)
def edit_feedback(feedback_id: int, data: FeedbackCreate,
                  db: Session = Depends(get_db),
                  manager:User  = Depends(require_role("manager"))):
    fb = db.query(Feedback).filter_by(id=feedback_id, manager_id=manager.id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    for field, value in data.model_dump().items():
        setattr(fb, field, value)
    db.commit()
    db.refresh(fb)
    return fb

@router.get("/my", response_model=list[FeedbackOut])
def view_my_feedback(user: User  = Depends(get_current_user),
                     db: Session = Depends(get_db)):
    if user.role.value == "employee":
        return db.query(Feedback).filter_by(employee_id=user.id).all()
    else:
        feedback_list = db.query(Feedback).filter_by(manager_id=user.id).all()
        return feedback_list

@router.patch("/acknowledge/{feedback_id}")
def acknowledge(feedback_id: int, user: User = Depends(require_role("employee")),
                db: Session = Depends(get_db)):
    fb = db.query(Feedback).filter_by(id=feedback_id, employee_id=user.id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="No such feedback")
    
    setattr(fb, "acknowledged", True)
    db.commit()
    return {"detail": "Acknowledged"}
