const API_BASE_URL = 'https://wellnesstracker-sample-backend.onrender.com';

const api = {
  // Helper to make authenticated requests
  _authenticatedRequest: async (method, path, body = null) => {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`${API_BASE_URL}${path}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || 'Something went wrong');
      error.statusCode = response.status;
      throw error;
    }
    return data;
  },

  // Authentication
  register: async (userData) => {
    return api._authenticatedRequest('POST', '/register', userData);
  },

  login: async (credentials) => {
    return api._authenticatedRequest('POST', '/login', credentials);
  },

  forgotPassword: async (email) => {
    return api._authenticatedRequest('POST', '/forgot-password', { email });
  },

  // Daily Entries
  getDashboard: async () => {
    return api._authenticatedRequest('GET', '/dashboard');
  },

  createDailyEntry: async (entryData) => {
    // This backend endpoint is POST /daily-entries and handles both creation and update for today's entry
    return api._authenticatedRequest('POST', '/daily-entries', entryData);
  },

  updateDailyEntry: async (id, updates) => {
    return api._authenticatedRequest('PUT', `/daily-entries/${id}`, updates);
  },

  deleteDailyEntry: async (id) => {
    return api._authenticatedRequest('DELETE', `/daily-entries/${id}`);
  },

  // Medications
  addMedication: async (medicationData) => {
    return api._authenticatedRequest('POST', '/medications', medicationData);
  },

  logMedication: async (medicationId) => {
    return api._authenticatedRequest('PATCH', '/medication-logs', { medication_id: medicationId });
  },

  // History
  getHistory: async (limit = 30, offset = 0) => {
    return api._authenticatedRequest('GET', `/history?limit=${limit}&offset=${offset}`);
  },

  // User Profile
  getUserProfile: async () => {
    return api._authenticatedRequest('GET', '/user/profile');
  },

  updateUserProfile: async (profileData) => {
    return api._authenticatedRequest('PUT', '/user/profile', profileData);
  }
};

export default api;