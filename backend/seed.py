from sqlmodel import Session
from database import engine, create_db_and_tables
from models import Question

def seed_database():
    create_db_and_tables()

    with Session(engine) as session:
        for item in sample_questions:
            question = Question(**item)
            session.add(question)

        session.commit()

    print("Database seeded successfully.")


if __name__ == "__main__":
    seed_database()