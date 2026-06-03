import React, { createContext, useContext, useState, useEffect } from 'react';
import dbService from '../services/db';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const DepotContext = createContext();

export const DepotProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all data from DB/LocalStorage
  const refreshData = async () => {
    setLoading(true);
    try {
      const [r, d, v, s, f, m, a] = await Promise.all([
        dbService.getRoutes(),
        dbService.getDrivers(),
        dbService.getVehicles(),
        dbService.getSchedules(),
        dbService.getFuelLogs(),
        dbService.getMaintenanceLogs(),
        dbService.getAuditLogs()
      ]);
      setRoutes(r);
      setDrivers(d);
      setVehicles(v);
      setSchedules(s);
      setFuelLogs(f);
      setMaintenanceLogs(m);
      setAuditLogs(a);
    } catch (e) {
      console.error("Error fetching depot data:", e);
      toast.error("Failed to sync some dashboard datasets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- Helpers for Conflict Detection ---
  const toMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins] = timeStr.split(':').map(Number);
    return hrs * 60 + mins;
  };

  const checkScheduleConflict = (newSchedule, excludeId = null) => {
    const { date, departureTime, arrivalTime, driverId, vehicleId, tripStatus } = newSchedule;
    if (tripStatus === 'Cancelled') return { hasConflict: false };

    const startNew = toMinutes(departureTime);
    const endNew = toMinutes(arrivalTime);

    // Filter out same schedule if editing
    const activeSchedules = schedules.filter(
      s => s.id !== excludeId && s.date === date && s.tripStatus !== 'Cancelled'
    );

    for (const s of activeSchedules) {
      const startOld = toMinutes(s.departureTime);
      const endOld = toMinutes(s.arrivalTime);

      // Check if times overlap
      const isOverlapping = startNew < endOld && startOld < endNew;

      if (isOverlapping) {
        // Driver conflict
        if (driverId && s.driverId === driverId) {
          const driverName = drivers.find(d => d.id === driverId)?.fullName || "Driver";
          return {
            hasConflict: true,
            type: 'driver',
            message: `Conflict Detected: ${driverName} is already assigned to another route (${s.departureTime} - ${s.arrivalTime}) on this day.`
          };
        }

        // Vehicle conflict
        if (vehicleId && s.vehicleId === vehicleId) {
          const regNo = vehicles.find(v => v.id === vehicleId)?.registrationNumber || "Vehicle";
          return {
            hasConflict: true,
            type: 'vehicle',
            message: `Conflict Detected: Bus ${regNo} is already scheduled on another route (${s.departureTime} - ${s.arrivalTime}) on this day.`
          };
        }
      }
    }

    return { hasConflict: false };
  };

  // --- CRUD Wrappers ---
  
  // Routes
  const addRoute = async (route) => {
    const res = await dbService.addRoute(route);
    setRoutes(prev => [...prev, res]);
    await dbService.addAuditLog('Add Route', `Created Route: ${route.routeName} (${route.routeNumber})`, currentUser?.email);
    toast.success("Route added successfully");
    return res;
  };

  const updateRoute = async (id, route) => {
    const res = await dbService.updateRoute(id, route);
    setRoutes(prev => prev.map(r => r.id === id ? res : r));
    await dbService.addAuditLog('Update Route', `Updated Route: ${route.routeName}`, currentUser?.email);
    toast.success("Route updated successfully");
    return res;
  };

  const deleteRoute = async (id) => {
    const target = routes.find(r => r.id === id);
    await dbService.deleteRoute(id);
    setRoutes(prev => prev.filter(r => r.id !== id));
    await dbService.addAuditLog('Delete Route', `Deleted Route: ${target?.routeName || id}`, currentUser?.email);
    toast.success("Route deleted successfully");
  };

  // Drivers
  const addDriver = async (driver) => {
    const res = await dbService.addDriver(driver);
    setDrivers(prev => [...prev, res]);
    await dbService.addAuditLog('Add Driver', `Created Driver: ${driver.fullName}`, currentUser?.email);
    toast.success("Driver profile created");
    return res;
  };

  const updateDriver = async (id, driver) => {
    const res = await dbService.updateDriver(id, driver);
    setDrivers(prev => prev.map(d => d.id === id ? res : d));
    await dbService.addAuditLog('Update Driver', `Updated Driver profile: ${driver.fullName}`, currentUser?.email);
    toast.success("Driver profile updated");
    return res;
  };

  const deleteDriver = async (id) => {
    const target = drivers.find(d => d.id === id);
    await dbService.deleteDriver(id);
    setDrivers(prev => prev.filter(d => d.id !== id));
    await dbService.addAuditLog('Delete Driver', `Deleted Driver: ${target?.fullName || id}`, currentUser?.email);
    toast.success("Driver deleted");
  };

  // Vehicles
  const addVehicle = async (vehicle) => {
    const res = await dbService.addVehicle(vehicle);
    setVehicles(prev => [...prev, res]);
    await dbService.addAuditLog('Add Vehicle', `Added Vehicle: ${vehicle.registrationNumber}`, currentUser?.email);
    toast.success("Vehicle registered");
    return res;
  };

  const updateVehicle = async (id, vehicle) => {
    const res = await dbService.updateVehicle(id, vehicle);
    setVehicles(prev => prev.map(v => v.id === id ? res : v));
    await dbService.addAuditLog('Update Vehicle', `Updated Vehicle: ${vehicle.registrationNumber}`, currentUser?.email);
    toast.success("Vehicle info updated");
    return res;
  };

  const deleteVehicle = async (id) => {
    const target = vehicles.find(v => v.id === id);
    await dbService.deleteVehicle(id);
    setVehicles(prev => prev.filter(v => v.id !== id));
    await dbService.addAuditLog('Delete Vehicle', `Removed Vehicle: ${target?.registrationNumber || id}`, currentUser?.email);
    toast.success("Vehicle deleted");
  };

  // Schedules
  const addSchedule = async (schedule) => {
    const conflict = checkScheduleConflict(schedule);
    if (conflict.hasConflict) {
      toast.error(conflict.message);
      throw new Error(conflict.message);
    }
    const res = await dbService.addSchedule(schedule);
    setSchedules(prev => [...prev, res]);
    
    // Also toggle vehicle/driver status if needed
    if (schedule.tripStatus === 'Active') {
      if (schedule.driverId) updateDriverStatus(schedule.driverId, 'On Trip');
      if (schedule.vehicleId) updateVehicleStatus(schedule.vehicleId, 'On Route');
    }

    await dbService.addAuditLog('Add Schedule', `Scheduled trip on route ${schedule.routeId}`, currentUser?.email);
    toast.success("Schedule created successfully");
    return res;
  };

  const updateSchedule = async (id, schedule) => {
    const conflict = checkScheduleConflict(schedule, id);
    if (conflict.hasConflict) {
      toast.error(conflict.message);
      throw new Error(conflict.message);
    }
    const res = await dbService.updateSchedule(id, schedule);
    setSchedules(prev => prev.map(s => s.id === id ? res : s));

    // Update statuses based on trip state
    if (schedule.tripStatus === 'Completed') {
      if (schedule.driverId) updateDriverStatus(schedule.driverId, 'Available');
      if (schedule.vehicleId) updateVehicleStatus(schedule.vehicleId, 'Available');
    } else if (schedule.tripStatus === 'Active') {
      if (schedule.driverId) updateDriverStatus(schedule.driverId, 'On Trip');
      if (schedule.vehicleId) updateVehicleStatus(schedule.vehicleId, 'On Route');
    } else if (schedule.tripStatus === 'Cancelled') {
      if (schedule.driverId) updateDriverStatus(schedule.driverId, 'Available');
      if (schedule.vehicleId) updateVehicleStatus(schedule.vehicleId, 'Available');
    }

    await dbService.addAuditLog('Update Schedule', `Updated Schedule status: ${schedule.tripStatus}`, currentUser?.email);
    toast.success("Schedule updated successfully");
    return res;
  };

  const deleteSchedule = async (id) => {
    await dbService.deleteSchedule(id);
    setSchedules(prev => prev.filter(s => s.id !== id));
    await dbService.addAuditLog('Delete Schedule', `Deleted Schedule ${id}`, currentUser?.email);
    toast.success("Schedule removed");
  };

  // Fuel Logs
  const addFuelLog = async (log) => {
    const res = await dbService.addFuelLog(log);
    setFuelLogs(prev => [...prev, res]);

    // Update vehicle mileage
    const vehicle = vehicles.find(v => v.id === log.vehicleId);
    if (vehicle && Number(log.mileage) > Number(vehicle.mileage)) {
      await updateVehicle(log.vehicleId, { ...vehicle, mileage: Number(log.mileage) });
    }

    await dbService.addAuditLog('Add Fuel Log', `Refueled vehicle ${log.vehicleId}: ${log.fuelAmount}L`, currentUser?.email);
    toast.success("Fuel log recorded");
    return res;
  };

  const deleteFuelLog = async (id) => {
    await dbService.deleteFuelLog(id);
    setFuelLogs(prev => prev.filter(l => l.id !== id));
    toast.success("Fuel log deleted");
  };

  // Maintenance Logs
  const addMaintenanceLog = async (log) => {
    const res = await dbService.addMaintenanceLog(log);
    setMaintenanceLogs(prev => [...prev, res]);

    // Update vehicle next maintenance dates & status
    const vehicle = vehicles.find(v => v.id === log.vehicleId);
    if (vehicle) {
      await updateVehicle(log.vehicleId, { 
        ...vehicle, 
        lastServiceDate: log.serviceDate,
        nextServiceDate: log.nextServiceDate,
        vehicleStatus: 'Available' // Set to available after completing maintenance
      });
    }

    await dbService.addAuditLog('Add Maintenance', `Vehicle ${log.vehicleId} serviced: ${log.serviceType}`, currentUser?.email);
    toast.success("Maintenance log added");
    return res;
  };

  const deleteMaintenanceLog = async (id) => {
    await dbService.deleteMaintenanceLog(id);
    setMaintenanceLogs(prev => prev.filter(l => l.id !== id));
    toast.success("Maintenance log deleted");
  };

  // Helper status updates
  const updateDriverStatus = async (driverId, status) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      const res = await dbService.updateDriver(driverId, { ...driver, driverStatus: status });
      setDrivers(prev => prev.map(d => d.id === driverId ? res : d));
    }
  };

  const updateVehicleStatus = async (vehicleId, status) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      const res = await dbService.updateVehicle(vehicleId, { ...vehicle, vehicleStatus: status });
      setVehicles(prev => prev.map(v => v.id === vehicleId ? res : v));
    }
  };

  return (
    <DepotContext.Provider value={{
      routes,
      drivers,
      vehicles,
      schedules,
      fuelLogs,
      maintenanceLogs,
      auditLogs,
      loading,
      refreshData,
      checkScheduleConflict,
      addRoute,
      updateRoute,
      deleteRoute,
      addDriver,
      updateDriver,
      deleteDriver,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      addFuelLog,
      deleteFuelLog,
      addMaintenanceLog,
      deleteMaintenanceLog
    }}>
      {children}
    </DepotContext.Provider>
  );
};

export const useDepot = () => useContext(DepotContext);
export default DepotContext;
