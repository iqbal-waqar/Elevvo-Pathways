from fastapi import FastAPI, HTTPException
from backend.schemas.student_schema import StudentCreate, StudentOut
from backend.services.ml_service import predict_score
from backend.interactors.student_interactor import create_student

app = FastAPI()

@app.post('/predict', response_model=StudentOut)
def predict(student: StudentCreate):
    score = predict_score(student.study_hours)
    student_obj = create_student(student.name, student.study_hours, score)
    return StudentOut(name=student_obj.name, study_hours=student_obj.study_hours, score=student_obj.score)
