from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.database.database import get_db
from app.models.cupping_note import CuppingNote
from app.models.sca_standard import SCAStandard
from app.models.mapping_result import AIMappingResult
from app.services.ai_service import ai_service

router = APIRouter()

class MappingRequest(BaseModel):
    cupping_note_id: int

class MappingResponse(BaseModel):
    id: int
    cupping_note_id: int
    sca_standard_id: int
    matched_score: float = None
    mapped_attribute: str = None
    mapped_value: float = None
    reasoning: str = None
    suggested_improvements: str = None
    created_at: str = None

    class Config:
        from_attributes = True

class AIMappingResult(BaseModel):
    success: bool
    cupping_note_id: int
    attribute_mappings: List[dict]
    improvements: List[str]
    overall_assessment: str
    confidence_score: float
    raw_response: str = None
    error: str = None

@router.post("/analyze", response_model=AIMappingResult)
def analyze_cupping_note(request: MappingRequest, db: Session = Depends(get_db)):
    """Analyze a cupping note using AI and map to SCA standards"""
    # Get the cupping note
    cupping_note = db.query(CuppingNote).filter(CuppingNote.id == request.cupping_note_id).first()
    if not cupping_note:
        raise HTTPException(status_code=404, detail="Cupping note not found")
    
    # Convert to dict for AI service
    cupping_data = {
        "sample_name": cupping_note.sample_name,
        "fragrance": cupping_note.fragrance,
        "aroma": cupping_note.aroma,
        "flavor": cupping_note.flavor,
        "aftertaste": cupping_note.aftertaste,
        "acidity": cupping_note.acidity,
        "body": cupping_note.body,
        "balance": cupping_note.balance,
        "uniformity": cupping_note.uniformity,
        "clean_cup": cupping_note.clean_cup,
        "sweetness": cupping_note.sweetness,
        "overall": cupping_note.overall,
        "subjective_notes": cupping_note.subjective_notes,
        "tasting_notes": cupping_note.tasting_notes,
        "total_score": cupping_note.total_score
    }
    
    # Call AI service
    ai_result = ai_service.map_cupping_notes_to_sca(cupping_data)
    
    # Store mapping results in database
    if ai_result.get("success"):
        # Save each attribute mapping
        for mapping in ai_result.get("attribute_mappings", []):
            # Find matching SCA standard
            standard = db.query(SCAStandard).filter(
                SCAStandard.attribute_name == mapping["attribute"]
            ).first()
            
            if standard:
                mapping_result = AIMappingResult(
                    cupping_note_id=request.cupping_note_id,
                    sca_standard_id=standard.id,
                    matched_score=ai_result.get("confidence_score"),
                    mapped_attribute=mapping["attribute"],
                    mapped_value=mapping["score"],
                    reasoning=mapping["reasoning"],
                    suggested_improvements="; ".join(ai_result.get("improvements", []))
                )
                db.add(mapping_result)
        
        db.commit()
    
    return AIMappingResult(
        success=ai_result.get("success", False),
        cupping_note_id=request.cupping_note_id,
        attribute_mappings=ai_result.get("attribute_mappings", []),
        improvements=ai_result.get("improvements", []),
        overall_assessment=ai_result.get("overall_assessment", ""),
        confidence_score=ai_result.get("confidence_score", 0),
        raw_response=ai_result.get("raw_response"),
        error=ai_result.get("error")
    )

@router.get("/{cupping_note_id}", response_model=List[MappingResponse])
def get_mapping_results(cupping_note_id: int, db: Session = Depends(get_db)):
    """Get all mapping results for a specific cupping note"""
    results = db.query(AIMappingResult).filter(
        AIMappingResult.cupping_note_id == cupping_note_id
    ).all()
    return results
