from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class CuppingNote(Base):
    __tablename__ = "cupping_notes"

    id = Column(Integer, primary_key=True, index=True)
    sample_name = Column(String(255), nullable=False)
    roaster = Column(String(255))
    origin = Column(String(255))
    process = Column(String(100))
    roast_date = Column(DateTime)
    cupping_date = Column(DateTime, server_default=func.now())

    # SCA Cupping Attributes (0-10 scale)
    fragrance = Column(Float)
    aroma = Column(Float)
    flavor = Column(Float)
    aftertaste = Column(Float)
    acidity = Column(Float)
    body = Column(Float)
    balance = Column(Float)
    uniformity = Column(Float)
    clean_cup = Column(Float)
    sweetness = Column(Float)
    overall = Column(Float)
    defects = Column(Integer, default=0)

    # Subjective notes
    subjective_notes = Column(Text)
    tasting_notes = Column(Text)

    # Calculated total score
    total_score = Column(Float)

    # Relationships
    mapping_results = relationship("AIMappingResult", back_populates="cupping_note")
