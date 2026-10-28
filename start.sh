#!/bin/bash

# BeanMind AI Startup Script

echo "Starting BeanMind AI..."

# Start Backend
echo "Starting Backend (FastAPI)..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
python -m app.database.init_sca_standards
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Start Frontend
echo "Starting Frontend (React + Vite)..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo "BeanMind AI is now running!"
echo "=========================================="
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=========================================="

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
