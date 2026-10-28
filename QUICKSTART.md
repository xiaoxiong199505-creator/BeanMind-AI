# Quick Start Guide

Get BeanMind AI running in 5 minutes!

## 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

## 2. Set Up the Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your API key:
# GEMINI_API_KEY=your_actual_api_key_here

# Initialize the database
python -m app.database.init_sca_standards
```

## 3. Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install
```

## 4. Run the Application

### Option A: Use the startup script (recommended)

**macOS/Linux:**
```bash
cd ..
./start.sh
```

**Windows:**
```bash
cd ..
start.bat
```

### Option B: Start manually

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## What's Next?

1. Open http://localhost:5173 in your browser
2. Click "New Cupping" to create your first cupping note
3. Fill in the sample information and scores
4. Click "Save & Analyze"
5. On the results page, click "Analyze with AI" to see AI-powered insights

## Troubleshooting

**"Module not found" errors:**
- Make sure you activated the virtual environment in the backend
- Make sure you ran `npm install` in the frontend

**"Database locked" error:**
- Make sure only one backend instance is running
- Delete `backend/beanmind.db` and re-run the initialization script

**"API key not found" error:**
- Check that your `.env` file exists in the `backend` folder
- Verify the API key is correct (no extra spaces)

**Frontend can't connect to backend:**
- Ensure backend is running on port 8000
- Check that you didn't change the port in the backend startup command

For more details, see the full [README.md](README.md).
