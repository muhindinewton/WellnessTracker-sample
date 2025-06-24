import React from 'react';
import { Home, Plus, Pill, BarChart3, Settings, LogOut } from 'lucide-react';
import { useApp } from '../appContext';

const Navigation = () => {
  const { user, currentRoute, navigate, logout } = useApp();

  if (!user) return null;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/track', icon: Plus, label: 'Track' },
    { path: '/medications', icon: Pill, label: 'Medications' },
    { path: '/history', icon: BarChart3, label: 'History' },
    { path: '/profile', icon: Settings, label: 'Profile' }
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-blue-600">WellnessTracker</h1>
            <div className="hidden md:flex space-x-6">
              {navItems.map(({ path, icon: Icon, label }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentRoute === path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hello, {user.name}</span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;