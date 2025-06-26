import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Announcements from './pages/Announcements';
import AnnouncementDetail from './pages/AnnouncementDetail';
import MyAnnouncements from './pages/driver/MyAnnouncements';
import CreateAnnouncement from './pages/driver/CreateAnnouncement';
import Requests from './pages/driver/Requests';
import MyRequests from './pages/sender/MyRequests';
import Chat from './pages/Chat';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/announcements" 
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/announcements/:id" 
            element={
              <ProtectedRoute>
                <AnnouncementDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />

          {/* Driver Routes */}
          <Route 
            path="/my-announcements" 
            element={
              <ProtectedRoute roles={['driver']}>
                <MyAnnouncements />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-announcement" 
            element={
              <ProtectedRoute roles={['driver']}>
                <CreateAnnouncement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-announcement/:id" 
            element={
              <ProtectedRoute roles={['driver']}>
                <CreateAnnouncement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/requests" 
            element={
              <ProtectedRoute roles={['driver']}>
                <Requests />
              </ProtectedRoute>
            } 
          />

          {/* Sender Routes */}
          <Route 
            path="/my-requests" 
            element={
              <ProtectedRoute roles={['sender']}>
                <MyRequests />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/announcements" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminAnnouncements />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;