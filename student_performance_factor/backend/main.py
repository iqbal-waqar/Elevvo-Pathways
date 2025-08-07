from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import pandas as pd
from backend.schemas.student_schema import StudentCreate, StudentOut
from backend.services.ml_service import predict_score, get_model_performance, get_regression_data
from backend.interactors.student_interactor import create_student

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))
app.mount("/style", StaticFiles(directory=os.path.join(frontend_dir, "style")), name="style")
app.mount("/script", StaticFiles(directory=os.path.join(frontend_dir, "script")), name="script")
app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dir, "assets")), name="assets")

@app.get("/")
def serve_index():
    path = "/home/rohail/Desktop/student_performance_factor/frontend/index.html"
    print("Trying to serve:", path)
    if not os.path.exists(path):
        print("File does not exist:", path)
        raise HTTPException(status_code=404, detail="index.html not found")
    return FileResponse(path)

@app.get("/data")
def get_data():
    df = pd.read_csv("/home/rohail/Desktop/student_performance_factor/ml/data/StudentPerformanceFactors.csv")
    # Handle NaN values for JSON serialization
    df = df.where(pd.notnull(df), None)
    # Return all data for flexible visualization
    return JSONResponse(content=df.to_dict(orient="records"))

@app.get("/data/columns")
def get_columns():
    df = pd.read_csv("/home/rohail/Desktop/student_performance_factor/ml/data/StudentPerformanceFactors.csv")
    return JSONResponse(content={"columns": list(df.columns)})

@app.post('/predict', response_model=StudentOut)
def predict(student: StudentCreate):
    score = predict_score(student.study_hours)
    student_obj = create_student(student.name, student.study_hours, score)
    return StudentOut(name=student_obj.name, study_hours=student_obj.study_hours, score=student_obj.score)

@app.get('/model/performance')
def model_performance():
    performance = get_model_performance()
    return JSONResponse(content=performance)

@app.get('/model/regression-data')
def regression_data(model_type: str = 'linear'):
    data = get_regression_data(model_type)
    return JSONResponse(content=data)

# Catch-all for SPA routing (only for GET, not static or API)
@app.get("/{full_path:path}")
def catch_all(full_path: str, request: Request):
    # If the path is for static or API, return 404
    if (
        full_path.startswith("style/")
        or full_path.startswith("script/")
        or full_path.startswith("assets/")
        or full_path.startswith("data")
        or full_path.startswith("predict")
        or "." in full_path  # for favicon.ico, etc.
    ):
        return FileResponse(os.path.join(frontend_dir, "index.html"))
    return FileResponse(os.path.join(frontend_dir, "index.html"))

