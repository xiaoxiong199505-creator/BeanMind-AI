from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime
from app.database.database import get_db
from app.models.cupping_note import CuppingNote

router = APIRouter()

# Pydantic models for request/response
class CuppingNoteCreate(BaseModel):
    sample_name: str
    roaster: str = None
    origin: str = None
    process: str = None
    roast_date: datetime = None
    fragrance: float = None
    aroma: float = None
    flavor: float = None
    aftertaste: float = None
    acidity: float = None
    body: float = None
    balance: float = None
    uniformity: float = None
    clean_cup: float = None
    sweetness: float = None
    overall: float = None
    defects: int = 0
    subjective_notes: str = None
    tasting_notes: str = None

class CuppingNoteResponse(BaseModel):
    id: int
    sample_name: str
    roaster: str = None
    origin: str = None
    process: str = None
    roast_date: datetime = None
    cupping_date: datetime = None
    fragrance: float = None
    aroma: float = None
    flavor: float = None
    aftertaste: float = None
    acidity: float = None
    body: float = None
    balance: float = None
    uniformity: float = None
    clean_cup: float = None
    sweetness: float = None
    overall: float = None
    defects: int = 0
    subjective_notes: str = None
    tasting_notes: str = None
    total_score: float = None

    class Config:
        from_attributes = True

@router.post("/", response_model=CuppingNoteResponse)
def create_cupping_note(note: CuppingNoteCreate, db: Session = Depends(get_db)):
    """Create a new cupping note"""
    # Calculate total score (SCA formula)
    total_score = 0
    scores = [
        note.fragrance, note.aroma, note.flavor, note.aftertaste,
        note.acidity, note.body, note.balance, note.uniformity,
        note.clean_cup, note.sweetness, note.overall
    ]
    
    # SCA scoring: sum of 10 attributes (each weighted) + overall
    # Simplified calculation for this application
    valid_scores = [s for s in scores if s is not None]
    if valid_scores:
        total_score = sum(valid_scores) / len(valid_scores) * 10
    
    db_note = CuppingNote(
        **note.model_dump(),
        total_score=total_score
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@router.get("/", response_model=List[CuppingNoteResponse])
def get_cupping_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all cupping notes with pagination"""
    notes = db.query(CuppingNote).offset(skip).limit(limit).all()
    return notes

@router.get("/{note_id}", response_model=CuppingNoteResponse)
def get_cupping_note(note_id: int, db: Session = Depends(get_db)):
    """Get a specific cupping note by ID"""
    note = db.query(CuppingNote).filter(CuppingNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Cupping note not found")
    return note

@router.delete("/{note_id}")
def delete_cupping_note(note_id: int, db: Session = Depends(get_db)):
    """Delete a cupping note"""
    note = db.query(CuppingNote).filter(CuppingNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Cupping note not found")
    db.delete(note)
    db.commit()
    return {"message": "Cupping note deleted successfully"}
