import { useState } from 'react';
import { curriculumAPI } from '../api/curriculum';

export default function Generator() {
  const [formData, setFormData] = useState({
    branch: 'Computer Science Engineering',
    focus: 'Artificial Intelligence',
    institution: 'NIT Default',
    futureWeight: 50,
    yearRange: '2024-2028'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await curriculumAPI.generate(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Generation failed. Check the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Settings Panel */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl h-fit">
        <h2 className="text-xl font-bold mb-4">Curriculum Setup</h2>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Engineering Branch</label>
            <select 
              value={formData.branch}
              onChange={(e) => setFormData({...formData, branch: e.target.value})}
              className="w-full bg-dark border border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="Computer Science Engineering">Computer Science Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              {/* Other branches can be added here */}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Focus Area</label>
            <input 
              type="text"
              value={formData.focus}
              onChange={(e) => setFormData({...formData, focus: e.target.value})}
              className="w-full bg-dark border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-dark font-bold py-2 px-4 rounded-lg hover:bg-blue-400 disabled:opacity-50"
          >
            {loading ? 'Generating AI Output...' : 'Generate Curriculum'}
          </button>
        </form>
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      </div>

      {/* Output Panel */}
      <div className="lg:col-span-2 bg-gray-900 border border-gray-800 p-6 rounded-xl min-h-[500px]">
        {result ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-accent">{result.branch}</h2>
              <span className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">Credits: {result.total_credits}</span>
            </div>
            
            <div className="space-y-8">
              {result.semesters?.map((sem, idx) => (
                <div key={idx} className="border border-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-lg border-b border-gray-800 pb-2 mb-4">
                    Semester {sem.sem} - <span className="text-gray-400 text-sm">{sem.theme}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sem.subjects?.map((sub, sidx) => (
                      <div key={sidx} className="bg-dark p-3 rounded border border-gray-800">
                        <div className="flex justify-between">
                          <span className="font-medium text-white">{sub.code}: {sub.name}</span>
                          {sub.is_emerging && <span className="text-green-400 text-xs">● Emerging</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{sub.category} | {sub.credits} Credits</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Configure options and click generate to view the AI output.
          </div>
        )}
      </div>
    </div>
  );
}
