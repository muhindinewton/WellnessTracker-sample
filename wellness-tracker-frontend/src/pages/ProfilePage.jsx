import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { useApp } from '../appContext';

const ProfilePage = () => {
  const { user, logout, api } = useApp();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.updateUserProfile(formData);
      // Update user in context and local storage
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      // Optionally, refresh user state in AppContext if necessary, though
      // direct modification to localStorage is picked up by AppProvider's useEffect
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Account Information</h3>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-500"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            {editing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member Since
            </label>
            <p className="text-gray-900">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {editing && (
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                // Reset form data if canceled
                setFormData({ name: user.name, email: user.email });
                setError('');
              }}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="border-t border-gray-200 mt-8 pt-8">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;