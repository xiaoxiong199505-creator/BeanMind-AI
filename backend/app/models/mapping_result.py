from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class AIMappingResult(Base):
    __tablename__ = "mapping_results"

    id = Column(Integer, primary_key=True, index=True)
    cupping_note_id = Column(Integer, ForeignKey("cupping_notes.id"), nullable=False)
    sca_standard_id = Column(Integer, ForeignKey("sca_standards.id"), nullable=False)

    # AI-generated mapping data
    matched_score = Column(Float)  # Confidence score 0-1
    mapped_attribute = Column(String(255))
    mapped_value = Column(Float)
    reasoning = Column(Text)
    suggested_improvements = Column(Text)

    # Timestamp
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    cupping_note = relationship("CuppingNote", back_populates="mapping_results")
    sca_standard = relationship("SCAStandard", back_populates="mapping_results")
