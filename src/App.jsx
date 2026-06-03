import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DepotProvider } from './context/DepotContext';

// Routing Guards
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/Dashboard';
import RoutesPage from './pages/Routes'; // Renamed to avoid name clash with react-router
import RouteDetails from './pages/RouteDetails';
import AddRoute from './pages/AddRoute';
import EditRoute from './pages/EditRoute';
import Schedules from './pages/Schedules';
import AddSchedule from './pages/AddSchedule';
import EditSchedule from './pages/EditSchedule';
import Drivers from './pages/Drivers';
import DriverProfile from './pages/DriverProfile';
import AddDriver from './pages/AddDriver';
import Vehicles from './pages/Vehicles';
import VehicleDetails from './pages/VehicleDetails';
import AddVehicle from './pages/AddVehicle';
import FuelLogs from './pages/FuelLogs';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  const allRoles = ['Admin', 'Supervisor', 'Staff'];
  const adminSupervisor = ['Admin', 'Supervisor'];
  const adminOnly = ['Admin'];

  return (
    <ThemeProvider>
      <AuthProvider>
        <DepotProvider>
          <Router>
            {/* React Hot Toast Notifications container */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: '12px',
                  borderRadius: '10px'
                }
              }} 
            />

            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Depot Dashboard Layout */}
              <Route path="/" element={<DashboardLayout />}>
                
                {/* Dashboard */}
                <Route index element={
                  <ProtectedRoute allowedRoles={allRoles}>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* Routes Module */}
                <Route path="routes" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <RoutesPage />
                  </ProtectedRoute>
                } />
                <Route path="routes/:id" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <RouteDetails />
                  </ProtectedRoute>
                } />
                <Route path="routes/add" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <AddRoute />
                  </ProtectedRoute>
                } />
                <Route path="routes/edit/:id" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <EditRoute />
                  </ProtectedRoute>
                } />

                {/* Schedules Module */}
                <Route path="schedules" element={
                  <ProtectedRoute allowedRoles={allRoles}>
                    <Schedules />
                  </ProtectedRoute>
                } />
                <Route path="schedules/add" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <AddSchedule />
                  </ProtectedRoute>
                } />
                <Route path="schedules/edit/:id" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <EditSchedule />
                  </ProtectedRoute>
                } />

                {/* Drivers Module */}
                <Route path="drivers" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <Drivers />
                  </ProtectedRoute>
                } />
                <Route path="drivers/:id" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <DriverProfile />
                  </ProtectedRoute>
                } />
                <Route path="drivers/add" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <AddDriver />
                  </ProtectedRoute>
                } />

                {/* Vehicles Module */}
                <Route path="vehicles" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <Vehicles />
                  </ProtectedRoute>
                } />
                <Route path="vehicles/:id" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <VehicleDetails />
                  </ProtectedRoute>
                } />
                <Route path="vehicles/add" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <AddVehicle />
                  </ProtectedRoute>
                } />

                {/* Fuel & Maintenance Module */}
                <Route path="fuel" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <FuelLogs />
                  </ProtectedRoute>
                } />
                <Route path="maintenance" element={
                  <ProtectedRoute allowedRoles={adminSupervisor}>
                    <Maintenance />
                  </ProtectedRoute>
                } />

                {/* Reports Module */}
                <Route path="reports" element={
                  <ProtectedRoute allowedRoles={allRoles}>
                    <Reports />
                  </ProtectedRoute>
                } />

                {/* Settings Module */}
                <Route path="settings" element={
                  <ProtectedRoute allowedRoles={adminOnly}>
                    <Settings />
                  </ProtectedRoute>
                } />

              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </DepotProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
