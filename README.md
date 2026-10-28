# BeanMind AI

An AI-assisted system for Apex Coffee Roasters to map subjective cupping notes to SCA (Specialty Coffee Association) standards using RAG (Retrieval-Augmented Generation).

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI + Python
- **Database**: SQLite (no Docker or PostgreSQL required)
- **AI**: Google Gemini 1.5 Pro
- **RAG Implementation**: In-memory knowledge base with keyword-based retrieval

## Features

- 📝 **Cupping Note Management**: Create, view, and delete SCA-standard cupping notes
- 🤖 **AI-Powered Analysis**: Map subjective notes to SCA standards using Google Gemini 1.5 Pro
- 📊 **Dashboard**: View all cupping notes with statistics and recent activity
- 📚 **SCA Standards Reference**: Built-in reference guide for SCA cupping protocols
- 🎯 **RAG Integration**: Retrieval-Augmented Generation for accurate standard mapping
- 💾 **SQLite Database**: Simple, file-based database with no external dependencies

## Project Structure

```
BeanMind-AI/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── database.py          # SQLite database setup
│   │   │   └── init_sca_standards.py # SCA standards initialization script
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── cupping_note.py      # Cupping note model
│   │   │   ├── sca_standard.py      # SCA standard model
│   │   │   └── mapping_result.py    # AI mapping result model
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── cupping.py           # Cupping notes API routes
│   │   │   ├── standards.py         # SCA standards API routes
│   │   │   └── mapping.py           # AI mapping API routes
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── ai_service.py        # Gemini AI service with RAG
│   │   ├── __init__.py
│   │   └── main.py                  # FastAPI application entry point
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Navigation component
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Main dashboard page
│   │   │   ├── CuppingForm.jsx      # Cupping note form
│   │   │   ├── Results.jsx          # Results and AI analysis page
│   │   │   └── Standards.jsx        # SCA standards reference page
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── logs/
└── README.md
```

## Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- npm or yarn
- Google Gemini API Key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Installation

### 1. Clone the Repository

```bash
cd BeanMind-AI
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key
```

### 3. Initialize Database

```bash
# Run the initialization script
python -m app.database.init_sca_standards
```

This will create the SQLite database (`beanmind.db`) and populate it with SCA cupping standards.

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Start the Backend

```bash
# From the backend directory
cd backend

# Activate virtual environment if not already active
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

API documentation (Swagger UI) will be available at `http://localhost:8000/docs`

### Start the Frontend

```bash
# From the frontend directory (in a new terminal)
cd frontend

# Start the Vite development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

### 1. Create a Cupping Note

- Navigate to the "New Cupping" page
- Fill in the sample information (name, origin, process, etc.)
- Enter SCA cupping scores (0-10 scale) for each attribute
- Add subjective notes and tasting notes
- Click "Save & Analyze"

### 2. View AI Analysis

- After saving, you'll be redirected to the Results page
- Click "Analyze with AI" to map your notes to SCA standards
- The AI will provide:
  - Attribute mappings with reasoning
  - Suggested improvements
  - Overall assessment
  - Confidence score

### 3. Dashboard

- View all cupping notes in the dashboard
- See statistics (total cuppings, average score, recent activity)
- Delete notes or view detailed results

### 4. SCA Standards Reference

- Browse the SCA cupping standards by category
- Reference the scale ranges and typical descriptors
- Use as a guide during cupping sessions

## API Endpoints

### Cupping Notes
- `POST /api/cupping/` - Create a new cupping note
- `GET /api/cupping/` - Get all cupping notes
- `GET /api/cupping/{id}` - Get a specific cupping note
- `DELETE /api/cupping/{id}` - Delete a cupping note

### SCA Standards
- `GET /api/standards/` - Get all SCA standards
- `GET /api/standards/{id}` - Get a specific standard
- `GET /api/standards/category/{category}` - Get standards by category

### AI Mapping
- `POST /api/mapping/analyze` - Analyze a cupping note with AI
- `GET /api/mapping/{cupping_note_id}` - Get mapping results for a note

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Database

The application uses SQLite, which stores data in a single file (`backend/beanmind.db`). This means:

- No database server installation required
- Easy to backup (just copy the file)
- Runs entirely on your local machine
- Perfect for development and small-scale use

### Database Schema

**cupping_notes**: Stores cupping evaluation data
- Sample information (name, origin, process, roast date)
- SCA attribute scores (fragrance, aroma, flavor, etc.)
- Subjective notes and tasting notes
- Calculated total score

**sca_standards**: SCA cupping standard reference data
- Category, attribute name, description
- Scale range and typical descriptors
- Example notes

**mapping_results**: AI-generated mapping data
- Links cupping notes to SCA standards
- Stores AI confidence scores and reasoning
- Suggested improvements

## AI/RAG Implementation

The application uses a simple RAG (Retrieval-Augmented Generation) approach:

1. **Knowledge Base**: SCA standards are stored in-memory as text
2. **Retrieval**: Keyword-based matching finds relevant standards
3. **Generation**: Google Gemini 1.5 Pro generates mappings and insights

This approach:
- Works without vector databases or complex infrastructure
- Provides accurate context-aware analysis
- Can be easily upgraded to use embeddings and vector similarity

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Backend (use production ASGI server)
cd backend
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Troubleshooting

### Backend Issues

**Database locked error:**
- Ensure only one backend instance is running
- Check that `beanmind.db` is not open in another program

**Gemini API errors:**
- Verify your API key is correct in `.env`
- Check your API key has quota available
- Ensure you have internet connectivity

### Frontend Issues

**API connection errors:**
- Ensure backend is running on port 8000
- Check the proxy configuration in `vite.config.js`
- Verify CORS settings in `app/main.py`

**Module not found errors:**
- Run `npm install` in the frontend directory
- Clear node_modules and reinstall if needed

## Future Enhancements

- [ ] Add user authentication and multi-user support
- [ ] Implement vector embeddings for better RAG retrieval
- [ ] Add export functionality (PDF, CSV)
- [ ] Include cupping session management
- [ ] Add historical trend analysis
- [ ] Implement batch analysis for multiple samples
- [ ] Add mobile-responsive design improvements
- [ ] Include cupping timer and workflow guidance

## License

This project is proprietary software for Apex Coffee Roasters.

## Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for Apex Coffee Roasters**
