import React, { useState } from 'react';
import { Home, Plus, Pill, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../appContext';

const Navigation = () => {
  const { user, currentRoute, navigate, logout } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/track', icon: Plus, label: 'Track' },
    { path: '/medications', icon: Pill, label: 'Medications' },
    { path: '/history', icon: BarChart3, label: 'History' },
    { path: '/profile', icon: Settings, label: 'Profile' }
  ];

  const handleMobileLinkClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

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
          
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hello, {user.name}</span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(({ path, icon: Icon, label }) => (
              <button
                key={path}
                onClick={() => handleMobileLinkClick(path)}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentRoute === path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5 mb-3">
              <span className="text-base font-medium text-gray-800">Hello, {user.name}</span>
            </div>
            <div className="px-2 space-y-1">
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;