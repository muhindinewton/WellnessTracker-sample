import React, { useState, useEffect } from 'react';
import { Moon, Activity, CheckCircle } from 'lucide-react';
import { useApp } from '../appContext';

const TrackPage = () => {
  const { user, api, navigate } = useApp();
  const [formData, setFormData] = useState({
    sleep_hours: '',
    exercise_minutes: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch today's entry to pre-fill form
  useEffect(() => {
    const fetchTodayEntry = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await api.getDashboard(); // Dashboard fetches today's entry
        if (data.daily_entry) {
          setFormData({
            sleep_hours: data.daily_entry.sleep_hours.toString(),
            exercise_minutes: data.daily_entry.exercise_minutes.toString(),
            notes: data.daily_entry.notes || ''
          });
        }
      } catch (error) {
        console.error('Error fetching today\'s entry:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayEntry();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // The backend's POST /daily-entries handles both creation and update for today
      await api.createDailyEntry({
        sleep_hours: parseFloat(formData.sleep_hours) || 0,
        exercise_minutes: parseInt(formData.exercise_minutes) || 0,
        notes: formData.notes
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating/updating entry:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
          <CheckCircle className="mx-auto mb-2" size={48} />
          <h2 className="text-xl font-semibold mb-2">Entry Saved Successfully!</h2>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Track Your Day</h1>
        <p className="text-gray-600">Log your sleep, exercise, and notes for today</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep Hours
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.sleep_hours}
                onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="8.5"
              />
              <Moon className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exercise Minutes
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={formData.exercise_minutes}
                onChange={(e) => setFormData({ ...formData, exercise_minutes: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="30"
              />
              <Activity className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="How was your day? Any observations about your wellness..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackPage;