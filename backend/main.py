from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import engine, Base, SessionLocal
import models
from routes import router

# Create tables in SQLite5. Product and Engineering Quality
# Include enough engineering quality to show how you work in practice. At minimum, include:
#
# Clear setup and run instructions
# A working deployment reviewers can access via your preferred deployment path
# Basic validation and error handling
# At least one meaningful automated test
# A short architecture note explaining what you prioritized and why
# AI-Native Workflow Note
# Because this is an AI-forward role, include a short note explaining:
#
# Which AI tools you used
# Where AI materially sped up your work
# What AI-generated output you changed or rejected
# How you verified correctness, UX quality, and implementation reliability
# We are evaluating practical AI usage, not volume of AI usage.
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: Seed users
    db = SessionLocal()
    if not db.query(models.User).first():
        db.add_all([models.User(username="Akhil"), models.User(username="varma"),models.User(username="sai")])
        db.commit()
    db.close()
    yield

app = FastAPI(title="AI-Native Doc Editor API", lifespan=lifespan)

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire up the API routes
app.include_router(router)