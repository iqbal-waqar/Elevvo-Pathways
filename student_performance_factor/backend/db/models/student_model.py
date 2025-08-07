from sqlalchemy import Column, Integer, String, Float
from backend.db.db import engine
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    study_hours = Column(Float, nullable=False)
    score = Column(Float, nullable=False)

# To create tables (for development, not for migrations)
# Base.metadata.create_all(bind=engine)
