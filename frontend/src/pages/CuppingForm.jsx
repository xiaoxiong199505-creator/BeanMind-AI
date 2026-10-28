import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cuppingAPI } from '../services/api';
import { Save, ArrowLeft } from 'lucide-react';

const CuppingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sample_name: '',
    roaster: 'Apex Coffee Roasters',
    origin: '',
    process: '',
    roast_date: '',
    fragrance: '',
    aroma: '',
    flavor: '',
    aftertaste: '',
    acidity: '',
    body: '',
    balance: '',
    uniformity: '',
    clean_cup: '',
    sweetness: '',
    overall: '',
    defects: 0,
    subjective_notes: '',
    tasting_notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert numeric fields
      const data = {
        ...formData,
        fragrance: formData.fragrance ? parseFloat(formData.fragrance) : null,
        aroma: formData.aroma ? parseFloat(formData.aroma) : null,
        flavor: formData.flavor ? parseFloat(formData.flavor) : null,
        aftertaste: formData.aftertaste ? parseFloat(formData.aftertaste) : null,
        acidity: formData.acidity ? parseFloat(formData.acidity) : null,
        body: formData.body ? parseFloat(formData.body) : null,
        balance: formData.balance ? parseFloat(formData.balance) : null,
        uniformity: formData.uniformity ? parseFloat(formData.uniformity) : null,
        clean_cup: formData.clean_cup ? parseFloat(formData.clean_cup) : null,
        sweetness: formData.sweetness ? parseFloat(formData.sweetness) : null,
        overall: formData.overall ? parseFloat(formData.overall) : null,
        defects: parseInt(formData.defects) || 0,
        roast_date: formData.roast_date ? new Date(formData.roast_date).toISOString() : null,
      };

      const response = await cuppingAPI.create(data);
      navigate(`/results/${response.data.id}`);
    } catch (error) {
      console.error('Error creating cupping note:', error);
      alert('Failed to create cupping note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ScoreInput = ({ label, name, value }) => (
    <div>
      <label className="block text-sm font-medium text-coffee-700 mb-1">
        {label} (0-10)
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={handleChange}
        step="0.1"
        min="0"
        max="10"
        className="w-full px-3 py-2 border border-coffee-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
      />
    </div>
  );

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
        <h1 className="text-3xl font-bold text-coffee-900">New Cupping Note</h1>
        <p className="text-coffee-600 mt-2">Record your SCA cupping evaluation</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* Sample Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-coffee-900 mb-4">Sample Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Sample Name *
              </label>
              <input
                type="text"
                name="sample_name"
                value={formData.sample_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-coffee-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Roaster
              </label>
              <input
                type="text"
                name="roaster"
                value={formData.roaster}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-coffee-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Origin
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-coffee-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Process
              </label>
              <input
                type="text"
                name="process"
                value={formData.process}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-coffee-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Roast Date
              </label>
              <input
                type="date"
                name="roast_date"
                value={formData.roast_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-coffee-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
              />
            </div>
          </div>
        </div>

        {/* SCA Attributes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-coffee-900 mb-4">SCA Cupping Attributes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScoreInput label="Fragrance" name="fragrance" value={formData.fragrance} />
            <ScoreInput label="Aroma" name="aroma" value={formData.aroma} />
            <ScoreInput label="Flavor" name="flavor" value={formData.flavor} />
            <ScoreInput label="Aftertaste" name="aftertaste" value={formData.aftertaste} />
            <ScoreInput label="Acidity" name="acidity" value={formData.acidity} />
            <ScoreInput label="Body" name="body" value={formData.body} />
            <ScoreInput label="Balance" name="balance" value={formData.balance} />
            <ScoreInput label="Uniformity" name="uniformity" value={formData.uniformity} />
            <ScoreInput label="Clean Cup" name="clean_cup" value={formData.clean_cup} />
            <ScoreInput label="Sweetness" name="sweetness" value={formData.sweetness} />
            <ScoreInput label="Overall" name="overall" value={formData.overall} />
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Defects
              </label>
              <input
                type="number"
                name="defects"
                value={formData.defects}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-coffee-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
              />
            </div>
          </div>
        </div>

        {/* Subjective Notes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-coffee-900 mb-4">Subjective Notes</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Subjective Notes
              </label>
              <textarea
                name="subjective_notes"
                value={formData.subjective_notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-coffee-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                placeholder="General observations and impressions..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Tasting Notes
              </label>
              <textarea
                name="tasting_notes"
                value={formData.tasting_notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-coffee-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                placeholder="Specific flavors and descriptors (e.g., jasmine, citrus, chocolate)..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-coffee-300 text-coffee-700 rounded-lg hover:bg-coffee-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-coffee-700 text-white px-6 py-2 rounded-lg hover:bg-coffee-800 transition flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save & Analyze'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CuppingForm;
