import React from 'react';
import { useApp } from './appContext';
import Navigation from './components/Navigation.jsx';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import TrackPage from './pages/TrackPage';
import MedicationsPage from './pages/MedicationsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  const { currentRoute, user } = useApp();

  const renderPage = () => {
    if (!user) {
      switch (currentRoute) {
        case '/login':
          return <LoginPage />;
        case '/register':
          return <RegisterPage />;
        case '/forgot-password':
          return <ForgotPasswordPage />;
        default:
          return <LandingPage />;
      }
    }

    switch (currentRoute) {
      case '/dashboard':
        return <Dashboard />;
      case '/track':
        return <TrackPage />;
      case '/medications':
        return <MedicationsPage />;
      case '/history':
        return <HistoryPage />;
      case '/profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {renderPage()}
    </div>
  );
};

export default App;