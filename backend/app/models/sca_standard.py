from sqlalchemy import Column, Integer, String, Text, Float
from sqlalchemy.orm import relationship
from app.database.database import Base

class SCAStandard(Base):
    __tablename__ = "sca_standards"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)  # e.g., "Flavor", "Acidity", "Body"
    attribute_name = Column(String(255), nullable=False)
    description = Column(Text)
    scale_range = Column(String(50))  # e.g., "6.0-7.5"
    typical_descriptors = Column(Text)  # Comma-separated descriptors
    example_notes = Column(Text)  # Example cupping notes for this standard

    # Relationships
    mapping_results = relationship("AIMappingResult", back_populates="sca_standard")
