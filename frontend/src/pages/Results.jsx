import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cuppingAPI, mappingAPI } from '../services/api';
import { ArrowLeft, Brain, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

const Results = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [cuppingNote, setCuppingNote] = useState(null);
  const [mappingResult, setMappingResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchCuppingNote();
  }, [noteId]);

  const fetchCuppingNote = async () => {
    try {
      const response = await cuppingAPI.getById(noteId);
      setCuppingNote(response.data);
      
      // Check if mapping already exists
      try {
        const mappingResponse = await mappingAPI.getResults(noteId);
        if (mappingResponse.data.length > 0) {
          setMappingResult(mappingResponse.data[0]);
        }
      } catch (error) {
        // No mapping exists yet
      }
    } catch (error) {
      console.error('Error fetching cupping note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await mappingAPI.analyze(noteId);
      setMappingResult(response.data);
    } catch (error) {
      console.error('Error analyzing cupping note:', error);
      alert('Failed to analyze cupping note. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-coffee-600">Loading...</div>
      </div>
    );
  }

  if (!cuppingNote) {
    return (
      <div className="text-center text-coffee-600">
        <p>Cupping note not found</p>
        <button onClick={() => navigate('/')} className="mt-4 text-coffee-700 hover:text-coffee-900">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center text-coffee-600 hover:text-coffee-900"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-coffee-900">{cuppingNote.sample_name}</h1>
        <p className="text-coffee-600 mt-2">
          {cuppingNote.origin} • {cuppingNote.process} • Total Score: {cuppingNote.total_score?.toFixed(1)}
        </p>
      </div>

      {/* AI Analysis Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-coffee-900 flex items-center">
            <Brain className="w-6 h-6 mr-2" />
            AI Analysis
          </h2>
          {!mappingResult && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-coffee-700 text-white px-4 py-2 rounded-lg hover:bg-coffee-800 transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Brain className="w-5 h-5" />
              <span>{analyzing ? 'Analyzing...' : 'Analyze with AI'}</span>
            </button>
          )}
        </div>

        {analyzing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-700 mx-auto"></div>
            <p className="mt-4 text-coffee-600">Analyzing cupping notes with AI...</p>
          </div>
        ) : mappingResult ? (
          <div className="space-y-6">
            {/* Overall Assessment */}
            <div className="bg-coffee-50 rounded-lg p-4">
              <h3 className="font-semibold text-coffee-900 mb-2">Overall Assessment</h3>
              <p className="text-coffee-700">{mappingResult.reasoning || cuppingNote.subjective_notes}</p>
            </div>

            {/* Improvements */}
            {mappingResult.suggested_improvements && (
              <div>
                <h3 className="font-semibold text-coffee-900 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Suggested Improvements
                </h3>
                <ul className="space-y-2">
                  {mappingResult.suggested_improvements.split(';').map((improvement, index) => (
                    <li key={index} className="flex items-start text-coffee-700">
                      <AlertCircle className="w-5 h-5 mr-2 text-coffee-500 flex-shrink-0 mt-0.5" />
                      <span>{improvement.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confidence Score */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-coffee-600">AI Confidence:</span>
              <div className="flex-1 bg-coffee-200 rounded-full h-2">
                <div
                  className="bg-coffee-700 h-2 rounded-full"
                  style={{ width: `${(mappingResult.matched_score || 0) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-coffee-900">
                {((mappingResult.matched_score || 0) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-coffee-600">
            <Brain className="w-16 h-16 mx-auto mb-4 text-coffee-400" />
            <p className="text-lg">No AI analysis yet</p>
            <p className="text-sm mt-2">Click "Analyze with AI" to map your cupping notes to SCA standards</p>
          </div>
        )}
      </div>

      {/* Cupping Scores */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-coffee-900 mb-4">SCA Cupping Scores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Fragrance', value: cuppingNote.fragrance },
            { label: 'Aroma', value: cuppingNote.aroma },
            { label: 'Flavor', value: cuppingNote.flavor },
            { label: 'Aftertaste', value: cuppingNote.aftertaste },
            { label: 'Acidity', value: cuppingNote.acidity },
            { label: 'Body', value: cuppingNote.body },
            { label: 'Balance', value: cuppingNote.balance },
            { label: 'Uniformity', value: cuppingNote.uniformity },
            { label: 'Clean Cup', value: cuppingNote.clean_cup },
            { label: 'Sweetness', value: cuppingNote.sweetness },
            { label: 'Overall', value: cuppingNote.overall },
          ].map((score) => (
            <div key={score.label} className="flex items-center justify-between p-3 bg-coffee-50 rounded-lg">
              <span className="text-coffee-700 font-medium">{score.label}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-coffee-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      score.value >= 8 ? 'bg-green-500' :
                      score.value >= 7 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(score.value || 0) * 10}%` }}
                  ></div>
                </div>
                <span className="text-coffee-900 font-semibold w-12 text-right">
                  {score.value?.toFixed(1) || 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {(cuppingNote.subjective_notes || cuppingNote.tasting_notes) && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-coffee-900 mb-4">Notes</h2>
          {cuppingNote.subjective_notes && (
            <div className="mb-4">
              <h3 className="font-medium text-coffee-700 mb-2">Subjective Notes</h3>
              <p className="text-coffee-600">{cuppingNote.subjective_notes}</p>
            </div>
          )}
          {cuppingNote.tasting_notes && (
            <div>
              <h3 className="font-medium text-coffee-700 mb-2">Tasting Notes</h3>
              <p className="text-coffee-600">{cuppingNote.tasting_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;
