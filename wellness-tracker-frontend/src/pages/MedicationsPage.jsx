import React, { useState, useEffect } from 'react';
import { Pill, Plus } from 'lucide-react';
import { useApp } from '../appContext';

const MedicationsPage = () => {
  const { user, api } = useApp();
  const [medications, setMedications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMedications();
  }, [user]);

  const loadMedications = async () => {
    if (!user) return;
    try {
      // The dashboard endpoint already returns medications
      const data = await api.getDashboard();
      setMedications(data.medications || []);
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addMedication(newMedication);
      setNewMedication({ name: '', dosage: '', frequency: '' });
      setShowAddForm(false);
      loadMedications(); // Reload the list
    } catch (error) {
      console.error('Error adding medication:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-600">Manage your medication schedule</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Medication</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Medication</h3>
          <form onSubmit={handleAddMedication} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  required
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Aspirin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  required
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 100mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  required
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Medication'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        {medications.length === 0 ? (
          <div className="p-8 text-center">
            <Pill className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medications added</h3>
            <p className="text-gray-600">Add your first medication to start tracking</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {medications.map((medication) => (
              <div key={medication.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Pill className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                      <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsPage;