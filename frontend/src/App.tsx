import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { verifyToken } from './store/slices/authSlice';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CitizenDashboard from './pages/citizen/Dashboard';
import SubmitGrievance from './pages/citizen/SubmitGrievance';
import MyGrievances from './pages/citizen/MyGrievances';
import MyProfile from './pages/citizen/MyProfile';
import AdminDashboard from './pages/admin/Dashboard';
import GrievanceManagement from './pages/admin/GrievanceManagement';
import ProviderDashboard from './pages/provider/Dashboard';
import AssignedGrievances from './pages/provider/AssignedGrievances';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading, token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, token, isAuthenticated]);

  const RoleBasedRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'provider':
        return <Navigate to="/provider/dashboard" replace />;
      default:
        return <Navigate to="/citizen/dashboard" replace />;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<RoleBasedRedirect />} />
        
        <Route path="citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="submit-grievance" element={<SubmitGrievance />} />
        <Route path="my-grievances" element={<MyGrievances />} />
        <Route path="my-profile" element={<MyProfile />} />
        
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/grievances" element={<GrievanceManagement />} />
        
        <Route path="provider/dashboard" element={<ProviderDashboard />} />
        <Route path="provider/grievances" element={<AssignedGrievances />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;