import React from 'react';
import { Moon, Activity, Pill } from 'lucide-react';
import { useApp } from '../appContext';

const LandingPage = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">WellnessTracker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Develop consistent wellness routines with our simple, secure platform. 
            Track sleep, exercise, medications, and more—all in one place.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Moon className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sleep Tracking</h3>
            <p className="text-gray-600">Monitor your sleep patterns and build better rest habits</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Exercise Logging</h3>
            <p className="text-gray-600">Track your daily activities and fitness progress</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Medication Management</h3>
            <p className="text-gray-600">Never miss a dose with our medication tracking system</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;