import { useState, useEffect } from 'react';
import { standardsAPI } from '../services/api';
import { BookOpen } from 'lucide-react';

const Standards = () => {
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    try {
      const response = await standardsAPI.getAll();
      setStandards(response.data);
    } catch (error) {
      console.error('Error fetching standards:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(standards.map(s => s.category))];

  const filteredStandards = selectedCategory === 'all'
    ? standards
    : standards.filter(s => s.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-coffee-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-coffee-900">SCA Cupping Standards</h1>
        <p className="text-coffee-600 mt-2">Reference guide for Specialty Coffee Association cupping protocols</p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === category
                  ? 'bg-coffee-700 text-white'
                  : 'bg-white text-coffee-700 hover:bg-coffee-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStandards.map(standard => (
          <div key={standard.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start space-x-3 mb-4">
              <BookOpen className="w-6 h-6 text-coffee-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-coffee-900">{standard.attribute_name}</h3>
                <span className="text-sm text-coffee-600">{standard.category}</span>
              </div>
            </div>
            
            <p className="text-coffee-700 mb-4">{standard.description}</p>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-coffee-900">Scale Range:</span>
                <span className="text-coffee-600 ml-2">{standard.scale_range}</span>
              </div>
              <div>
                <span className="font-medium text-coffee-900">Typical Descriptors:</span>
                <span className="text-coffee-600 ml-2">{standard.typical_descriptors}</span>
              </div>
              {standard.example_notes && (
                <div>
                  <span className="font-medium text-coffee-900">Example Notes:</span>
                  <span className="text-coffee-600 ml-2">{standard.example_notes}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredStandards.length === 0 && (
        <div className="text-center py-12 text-coffee-600">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-coffee-400" />
          <p className="text-lg">No standards found for this category</p>
        </div>
      )}
    </div>
  );
};

export default Standards;
