@echo off
REM BeanMind AI Startup Script for Windows

echo Starting BeanMind AI...

REM Start Backend
echo Starting Backend (FastAPI)...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt > nul 2>&1
python -m app.database.init_sca_standards
start "BeanMind Backend" cmd /k "uvicorn app.main:app --reload --port 8000"
cd ..

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

REM Start Frontend
echo Starting Frontend (React + Vite)...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
start "BeanMind Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ==========================================
echo BeanMind AI is now running!
echo ==========================================
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Close the terminal windows to stop the servers
echo ==========================================
pause
