from backend.db.models.student_model import Student
from backend.db.db import SessionLocal

def create_student(name: str, study_hours: float, score: float):
    db = SessionLocal()
    student = Student(name=name, study_hours=study_hours, score=score)
    db.add(student)
    db.commit()
    db.refresh(student)
    db.close()
    return student

def get_student_by_name(name: str):
    db = SessionLocal()
    student = db.query(Student).filter(Student.name == name).first()
    db.close()
    return student
