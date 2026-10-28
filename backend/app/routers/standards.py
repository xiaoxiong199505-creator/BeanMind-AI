from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.database.database import get_db
from app.models.sca_standard import SCAStandard

router = APIRouter()

class SCAStandardResponse(BaseModel):
    id: int
    category: str
    attribute_name: str
    description: str = None
    scale_range: str = None
    typical_descriptors: str = None
    example_notes: str = None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[SCAStandardResponse])
def get_sca_standards(db: Session = Depends(get_db)):
    """Get all SCA cupping standards"""
    standards = db.query(SCAStandard).all()
    return standards

@router.get("/{standard_id}", response_model=SCAStandardResponse)
def get_sca_standard(standard_id: int, db: Session = Depends(get_db)):
    """Get a specific SCA standard by ID"""
    standard = db.query(SCAStandard).filter(SCAStandard.id == standard_id).first()
    if not standard:
        raise HTTPException(status_code=404, detail="SCA standard not found")
    return standard

@router.get("/category/{category}", response_model=List[SCAStandardResponse])
def get_standards_by_category(category: str, db: Session = Depends(get_db)):
    """Get SCA standards by category"""
    standards = db.query(SCAStandard).filter(SCAStandard.category == category).all()
    return standards
