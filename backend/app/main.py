from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import cupping, standards, mapping
from app.database.database import init_db
from app.database.init_sca_standards import init_sca_standards

app = FastAPI(
    title="BeanMind AI",
    description="AI-assisted system for mapping subjective cupping notes to SCA standards",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cupping.router, prefix="/api/cupping", tags=["cupping"])
app.include_router(standards.router, prefix="/api/standards", tags=["standards"])
app.include_router(mapping.router, prefix="/api/mapping", tags=["mapping"])

@app.on_event("startup")
async def startup_event():
    init_db()
    init_sca_standards()

@app.get("/")
async def root():
    return {"message": "BeanMind AI API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
