import random

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from sqlmodel import Session, select

from database import create_db_and_tables, get_session
from models import Question, QuizAttempt


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://your-vercel-link.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def home():
    return {"message": "Quiz API is running"}


@app.get("/subjects")
def get_subjects():
    return [
        "Mathematics",
        "General Engineering and Applied Sciences",
        "Electronics",
        "Electronics Systems and Technologies"
    ]


@app.get("/quiz/{subject}")
def get_quiz(subject: str, session: Session = Depends(get_session)):
    questions = session.exec(
        select(Question).where(Question.subject == subject.strip())
    ).all()

    random.shuffle(questions)

    return questions


@app.post("/submit-score")
def submit_score(
    subject: str,
    score: int,
    total_questions: int,
    session: Session = Depends(get_session)
):
    attempt = QuizAttempt(
        subject=subject,
        score=score,
        total_questions=total_questions
    )

    session.add(attempt)
    session.commit()

    return {"message": "Score saved successfully"}


@app.get("/history")
def get_history(session: Session = Depends(get_session)):
    history = session.exec(select(QuizAttempt)).all()
    return history