import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cuppingAPI } from '../services/api';
import { Plus, Coffee, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [cuppingNotes, setCuppingNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCuppingNotes();
  }, []);

  const fetchCuppingNotes = async () => {
    try {
      const response = await cuppingAPI.getAll();
      setCuppingNotes(response.data);
    } catch (error) {
      console.error('Error fetching cupping notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cupping note?')) {
      try {
        await cuppingAPI.delete(id);
        fetchCuppingNotes();
      } catch (error) {
        console.error('Error deleting cupping note:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-coffee-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-coffee-900">Dashboard</h1>
          <p className="text-coffee-600 mt-2">Apex Coffee Roasters - Cupping Notes</p>
        </div>
        <Link
          to="/cupping"
          className="bg-coffee-700 text-white px-4 py-2 rounded-lg hover:bg-coffee-800 transition flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Cupping</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-coffee-600 text-sm">Total Cuppings</p>
              <p className="text-3xl font-bold text-coffee-900">{cuppingNotes.length}</p>
            </div>
            <Coffee className="w-12 h-12 text-coffee-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-coffee-600 text-sm">Average Score</p>
              <p className="text-3xl font-bold text-coffee-900">
                {cuppingNotes.length > 0
                  ? (cuppingNotes.reduce((sum, note) => sum + (note.total_score || 0), 0) / cuppingNotes.length).toFixed(1)
                  : '0'}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-coffee-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-coffee-600 text-sm">Recent Activity</p>
              <p className="text-3xl font-bold text-coffee-900">
                {cuppingNotes.filter(note => {
                  const date = new Date(note.cupping_date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date > weekAgo;
                }).length}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-coffee-500" />
          </div>
        </div>
      </div>

      {/* Cupping Notes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-coffee-200">
          <h2 className="text-xl font-semibold text-coffee-900">Recent Cupping Notes</h2>
        </div>
        {cuppingNotes.length === 0 ? (
          <div className="p-8 text-center text-coffee-600">
            <Coffee className="w-16 h-16 mx-auto mb-4 text-coffee-400" />
            <p className="text-lg">No cupping notes yet</p>
            <p className="text-sm mt-2">Start by creating your first cupping note</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-coffee-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-coffee-700 uppercase tracking-wider">
                  Sample Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-coffee-700 uppercase tracking-wider">
                  Origin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-coffee-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-coffee-700 uppercase tracking-wider">
                  Total Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-coffee-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-200">
              {cuppingNotes.map((note) => (
                <tr key={note.id} className="hover:bg-coffee-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-coffee-900">{note.sample_name}</div>
                    <div className="text-sm text-coffee-600">{note.roaster}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-coffee-600">
                    {note.origin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-coffee-600">
                    {new Date(note.cupping_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-sm font-medium rounded ${
                      note.total_score >= 85 ? 'bg-green-100 text-green-800' :
                      note.total_score >= 75 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {note.total_score?.toFixed(1) || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      to={`/results/${note.id}`}
                      className="text-coffee-600 hover:text-coffee-900"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
