from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import Counter
from app.models.models import Feedback, User
from app.utils.auth import require_role, get_db
from typing import Dict, Union

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/manager")
def manager_dashboard(user: User = Depends(require_role("manager")),
                      db: Session = Depends(get_db))-> Dict[str, Union[int, Dict[str, int]]]:
    team_feedbacks = db.query(Feedback).filter_by(manager_id=user.id).all()
    sentiments = [str(fb.sentiment) for fb in team_feedbacks]
    sentiment_stats = Counter(sentiments)
    return {
        "total_feedback": len(team_feedbacks),
        "sentiment_distribution": sentiment_stats
    }

@router.get("/employee")
def employee_dashboard(user: User = Depends(require_role("employee")),
                       db: Session = Depends(get_db)):
    timeline = db.query(Feedback).filter_by(employee_id=user.id).order_by(Feedback.timestamp.desc()).all()
    return timeline
