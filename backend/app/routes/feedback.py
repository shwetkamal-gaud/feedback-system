from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import Feedback, User, Team, FeedbackRequest, Notification, RequestStatus
from app.utils.auth import require_role, get_db, get_current_user
from app.schema import FeedbackCreate, FeedbackOut, FeedbackRequestIn, FeedbackRequestOut
from datetime import datetime, timezone
from typing import cast
router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("/", response_model=FeedbackOut)
def submit_feedback(data: FeedbackCreate,
                    db: Session = Depends(get_db),
                    manager:User  = Depends(require_role("manager"))):
    team = db.query(Team).filter_by(manager_id=manager.id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Manager has no team")

    employee = db.query(User).filter_by(id=data.employee_id, team_id=team.id, role="employee").first()
    if not employee:
        raise HTTPException(status_code=403, detail="You can only submit feedback to your team members")

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

@router.get("/", response_model=list[FeedbackOut])
def view_my_feedback(user: User  = Depends(get_current_user),
                     db: Session = Depends(get_db)):
    if user.role.value == "employee":
        return db.query(Feedback).filter_by(employee_id=user.id).all()
    else:
        feedback_list = db.query(Feedback).filter_by(manager_id=user.id).all()
        return feedback_list

@router.get("/single/{feedback_id}")
def get_single(feedback_id: int, data: FeedbackCreate,
                  db: Session = Depends(get_db)):
    
    fb = db.query(Feedback).filter_by(id=feedback_id,).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return fb

@router.patch("/acknowledge/{feedback_id}")
def acknowledge(feedback_id: int, user: User = Depends(require_role("employee")),
                db: Session = Depends(get_db)):
    fb = db.query(Feedback).filter_by(id=feedback_id, employee_id=user.id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="No such feedback")
    
    setattr(fb, "acknowledged", True)
    db.add(Notification(
        user_id=user.team.manager_id,
        message=f"{user.name} has requested feedback."
    ))
    db.commit()
    return {"detail": "Acknowledged"}

@router.get("/team/members")
def get_team_members(user: User = Depends(require_role("manager")), db: Session = Depends(get_db)):
    return db.query(User).filter_by(team_id=user.id, role="employee").all()


@router.post("/request", response_model=FeedbackRequestOut)
def request_feedback(message_data: FeedbackRequestIn,
                     db: Session = Depends(get_db),
                     employee: User = Depends(require_role("employee"))):
    if not employee.team or not employee.team.manager_id:
        raise HTTPException(400, detail="You are not assigned to a team or your team has no manager")

    new_request = FeedbackRequest(
        employee_id=employee.id,
        manager_id=employee.team.manager_id,
        message=message_data.message,
    )
    db.add(new_request)

    db.add(Notification(
        user_id=employee.team.manager_id,
        message=f"{employee.name} has requested feedback."
    ))

    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/request", response_model=list[FeedbackRequestOut])
def get_feedback_requests(db: Session = Depends(get_db),
                          manager: User = Depends(require_role("manager"))):
    return db.query(FeedbackRequest).filter_by(manager_id=manager.id, status="pending").all()


@router.patch("/requests/{request_id}", response_model=FeedbackRequestOut)
def respond_to_feedback_request(request_id: int, 
                                new_status: str,
                                db: Session = Depends(get_db),
                                manager: User = Depends(require_role("manager"))):
    req = db.query(FeedbackRequest).filter_by(id=request_id, manager_id=manager.id).first()
    if not req:
        raise HTTPException(404, detail="Request not found")

    req.status = cast(RequestStatus, new_status)

    db.add(Notification(
        user_id=req.employee_id,
        message=f"Your feedback request was marked as '{new_status}'"
    ))

    db.commit()
    return req


