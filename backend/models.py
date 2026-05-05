from typing import Optional
from sqlmodel import SQLModel, Field


class Question(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    subject: str
    question_text: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_answer: str


class QuizAttempt(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    subject: str
    score: int
    total_questions: int