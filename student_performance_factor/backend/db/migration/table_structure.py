from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    study_hours = Column(Float, nullable=False)
    score = Column(Float, nullable=False)
    # Add more columns as needed based on your CSV and requirements
