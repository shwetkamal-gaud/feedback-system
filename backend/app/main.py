from fastapi import FastAPI
from app.routes import user, feedback, dashboard
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Feedback API", version="1.0.0")

app.include_router(user.router)
app.include_router(feedback.router)
app.include_router(dashboard.router)
