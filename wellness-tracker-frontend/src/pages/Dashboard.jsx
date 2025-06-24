import React, { useState, useEffect } from 'react';
import { Moon, Activity, Pill, CheckCircle, Circle } from 'lucide-react';
import { useApp } from '../appContext';

const Dashboard = () => {
  const { user, api } = useApp();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]); // Re-run if user changes

  const loadDashboard = async () => {
    if (!user) { // Don't load if user is not set
      setLoading(false);
      return;
    }
    try {
      const data = await api.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMedication = async (medicationId) => {
    try {
      await api.logMedication(medicationId);
      loadDashboard(); // Reload dashboard to reflect changes
    } catch (error) {
      console.error('Error logging medication:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const today = new Date().toDateString();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">{today}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Sleep Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sleep</h3>
            <Moon className="text-blue-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {dashboardData?.daily_entry?.sleep_hours || 0}h
          </div>
          <p className="text-sm text-gray-600">Hours of sleep</p>
        </div>

        {/* Exercise Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Exercise</h3>
            <Activity className="text-green-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {dashboardData?.daily_entry?.exercise_minutes || 0}m
          </div>
          <p className="text-sm text-gray-600">Minutes of exercise</p>
        </div>

        {/* Medications Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
            <Pill className="text-purple-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {dashboardData?.medication_logs?.filter(log => log.taken).length || 0}/
            {dashboardData?.medications?.length || 0}
          </div>
          <p className="text-sm text-gray-600">Taken today</p>
        </div>
      </div>

      {/* Today's Medications */}
      {dashboardData?.medications?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Today's Medications</h3>
          <div className="space-y-3">
            {dashboardData.medications.map(medication => {
              const log = dashboardData.medication_logs?.find(l => l.medication_id === medication.id);
              const taken = log?.taken || false;
              
              return (
                <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleMedication(medication.id)}
                      className={`p-1 rounded-full ${taken ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {taken ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </button>
                    <div>
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    taken ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {taken ? 'Taken' : 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's Notes */}
      {dashboardData?.daily_entry?.notes && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Today's Notes</h3>
          <p className="text-gray-700">{dashboardData.daily_entry.notes}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;