from pydantic import BaseModel

class StudentBase(BaseModel):
    name: str
    study_hours: float

class StudentCreate(StudentBase):
    pass

class StudentOut(StudentBase):
    score: float

    class Config:
        orm_mode = True
