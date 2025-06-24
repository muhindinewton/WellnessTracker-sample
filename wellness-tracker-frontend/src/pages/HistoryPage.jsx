import React, { useState, useEffect } from 'react';
import { Calendar, Moon, Activity } from 'lucide-react';
import { useApp } from '../appContext';

const HistoryPage = () => {
  const { user, api } = useApp();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getHistory(); // The backend history endpoint directly returns entries
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health History</h1>
        <p className="text-gray-600">Review your past wellness entries</p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
          <p className="text-gray-600">Start tracking your wellness to see your history here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Moon className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Sleep</div>
                    <div className="text-lg font-semibold">{entry.sleep_hours}h</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Activity className="text-green-600" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Exercise</div>
                    <div className="text-lg font-semibold">{entry.exercise_minutes}m</div>
                  </div>
                </div>
              </div>
              
              {entry.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Notes</div>
                  <p className="text-gray-900">{entry.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;