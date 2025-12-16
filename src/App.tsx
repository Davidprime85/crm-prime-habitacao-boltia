import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AttendantDashboard } from './pages/AttendantDashboard';
import { ClientDashboard } from './pages/ClientDashboard';

function AppContent() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Login />;
  }

  switch (profile.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'attendant':
      return <AttendantDashboard />;
    case 'client':
      return <ClientDashboard />;
    default:
      return <Login />;
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
