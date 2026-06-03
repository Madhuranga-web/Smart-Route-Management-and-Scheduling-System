import { db, hasFirebaseConfig } from '../firebase/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  INITIAL_ROUTES, 
  INITIAL_DRIVERS, 
  INITIAL_VEHICLES, 
  INITIAL_SCHEDULES, 
  INITIAL_FUEL_LOGS, 
  INITIAL_MAINTENANCE_LOGS,
  AUDIT_LOGS
} from '../data/dummyData';

// Helper to initialize localStorage fallback data
const initLocalStorage = () => {
  if (!localStorage.getItem('srmss_initialized')) {
    localStorage.setItem('srmss_routes', JSON.stringify(INITIAL_ROUTES));
    localStorage.setItem('srmss_drivers', JSON.stringify(INITIAL_DRIVERS));
    localStorage.setItem('srmss_vehicles', JSON.stringify(INITIAL_VEHICLES));
    localStorage.setItem('srmss_schedules', JSON.stringify(INITIAL_SCHEDULES));
    localStorage.setItem('srmss_fuel_logs', JSON.stringify(INITIAL_FUEL_LOGS));
    localStorage.setItem('srmss_maintenance_logs', JSON.stringify(INITIAL_MAINTENANCE_LOGS));
    localStorage.setItem('srmss_audit_logs', JSON.stringify(AUDIT_LOGS));
    localStorage.setItem('srmss_initialized', 'true');
    console.log("Local Storage preloaded with Sri Lankan dummy data.");
  }
};

initLocalStorage();

// Standard CRUD helpers for local storage
const getLocal = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Unified DB Service
export const dbService = {
  // --- ROUTES ---
  async getRoutes() {
    if (hasFirebaseConfig && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'routes'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn("Firestore error, reading local storage", e);
        return getLocal('srmss_routes');
      }
    }
    return getLocal('srmss_routes');
  },

  async addRoute(route) {
    if (hasFirebaseConfig && db) {
      try {
        const docRef = await addDoc(collection(db, 'routes'), route);
        return { id: docRef.id, ...route };
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const routes = getLocal('srmss_routes');
    const newRoute = { id: 'r_' + Date.now(), ...route };
    routes.push(newRoute);
    setLocal('srmss_routes', routes);
    return newRoute;
  },

  async updateRoute(id, updatedRoute) {
    if (hasFirebaseConfig && db) {
      try {
        const ref = doc(db, 'routes', id);
        await updateDoc(ref, updatedRoute);
        return { id, ...updatedRoute };
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const routes = getLocal('srmss_routes');
    const index = routes.findIndex(r => r.id === id);
    if (index !== -1) {
      routes[index] = { ...routes[index], ...updatedRoute };
      setLocal('srmss_routes', routes);
      return routes[index];
    }
    throw new Error("Route not found");
  },

  async deleteRoute(id) {
    if (hasFirebaseConfig && db) {
      try {
        await deleteDoc(doc(db, 'routes', id));
        return id;
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    let routes = getLocal('srmss_routes');
    routes = routes.filter(r => r.id !== id);
    setLocal('srmss_routes', routes);
    return id;
  },

  // --- DRIVERS ---
  async getDrivers() {
    if (hasFirebaseConfig && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'drivers'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn("Firestore read error, reading local storage", e);
        return getLocal('srmss_drivers');
      }
    }
    return getLocal('srmss_drivers');
  },

  async addDriver(driver) {
    if (hasFirebaseConfig && db) {
      try {
        const docRef = await addDoc(collection(db, 'drivers'), driver);
        return { id: docRef.id, ...driver };
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const drivers = getLocal('srmss_drivers');
    const newDriver = { id: 'd_' + Date.now(), ...driver };
    drivers.push(newDriver);
    setLocal('srmss_drivers', drivers);
    return newDriver;
  },

  async updateDriver(id, updatedDriver) {
    if (hasFirebaseConfig && db) {
      try {
        const ref = doc(db, 'drivers', id);
        await updateDoc(ref, updatedDriver);
        return { id, ...updatedDriver };
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const drivers = getLocal('srmss_drivers');
    const index = drivers.findIndex(d => d.id === id);
    if (index !== -1) {
      drivers[index] = { ...drivers[index], ...updatedDriver };
      setLocal('srmss_drivers', drivers);
      return drivers[index];
    }
    throw new Error("Driver not found");
  },

  async deleteDriver(id) {
    if (hasFirebaseConfig && db) {
      try {
        await deleteDoc(doc(db, 'drivers', id));
        return id;
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    let drivers = getLocal('srmss_drivers');
    drivers = drivers.filter(d => d.id !== id);
    setLocal('srmss_drivers', drivers);
    return id;
  },

  // --- VEHICLES ---
  async getVehicles() {
    if (hasFirebaseConfig && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'vehicles'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn("Firestore read error, reading local storage", e);
        return getLocal('srmss_vehicles');
      }
    }
    return getLocal('srmss_vehicles');
  },

  async addVehicle(vehicle) {
    if (hasFirebaseConfig && db) {
      try {
        const docRef = await addDoc(collection(db, 'vehicles'), vehicle);
        return { id: docRef.id, ...vehicle };
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const vehicles = getLocal('srmss_vehicles');
    const newVehicle = { id: 'v_' + Date.now(), ...vehicle };
    vehicles.push(newVehicle);
    setLocal('srmss_vehicles', vehicles);
    return newVehicle;
  },

  async updateVehicle(id, updatedVehicle) {
    if (hasFirebaseConfig && db) {
      try {
        const ref = doc(db, 'vehicles', id);
        await updateDoc(ref, updatedVehicle);
        return { id, ...updatedVehicle };
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const vehicles = getLocal('srmss_vehicles');
    const index = vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updatedVehicle };
      setLocal('srmss_vehicles', vehicles);
      return vehicles[index];
    }
    throw new Error("Vehicle not found");
  },

  async deleteVehicle(id) {
    if (hasFirebaseConfig && db) {
      try {
        await deleteDoc(doc(db, 'vehicles', id));
        return id;
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    let vehicles = getLocal('srmss_vehicles');
    vehicles = vehicles.filter(v => v.id !== id);
    setLocal('srmss_vehicles', vehicles);
    return id;
  },

  // --- SCHEDULES ---
  async getSchedules() {
    if (hasFirebaseConfig && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'schedules'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn("Firestore read error, reading local storage", e);
        return getLocal('srmss_schedules');
      }
    }
    return getLocal('srmss_schedules');
  },

  async addSchedule(schedule) {
    if (hasFirebaseConfig && db) {
      try {
        const docRef = await addDoc(collection(db, 'schedules'), schedule);
        return { id: docRef.id, ...schedule };
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const schedules = getLocal('srmss_schedules');
    const newSchedule = { id: 's_' + Date.now(), ...schedule };
    schedules.push(newSchedule);
    setLocal('srmss_schedules', schedules);
    return newSchedule;
  },

  async updateSchedule(id, updatedSchedule) {
    if (hasFirebaseConfig && db) {
      try {
        const ref = doc(db, 'schedules', id);
        await updateDoc(ref, updatedSchedule);
        return { id, ...updatedSchedule };
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const schedules = getLocal('srmss_schedules');
    const index = schedules.findIndex(s => s.id === id);
    if (index !== -1) {
      schedules[index] = { ...schedules[index], ...updatedSchedule };
      setLocal('srmss_schedules', schedules);
      return schedules[index];
    }
    throw new Error("Schedule not found");
  },

  async deleteSchedule(id) {
    if (hasFirebaseConfig && db) {
      try {
        await deleteDoc(doc(db, 'schedules', id));
        return id;
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    let schedules = getLocal('srmss_schedules');
    schedules = schedules.filter(s => s.id !== id);
    setLocal('srmss_schedules', schedules);
    return id;
  },

  // --- FUEL LOGS ---
  async getFuelLogs() {
    if (hasFirebaseConfig && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'fuelLogs'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn("Firestore read error, reading local storage", e);
        return getLocal('srmss_fuel_logs');
      }
    }
    return getLocal('srmss_fuel_logs');
  },

  async addFuelLog(log) {
    if (hasFirebaseConfig && db) {
      try {
        const docRef = await addDoc(collection(db, 'fuelLogs'), log);
        return { id: docRef.id, ...log };
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const logs = getLocal('srmss_fuel_logs');
    const newLog = { id: 'f_' + Date.now(), ...log };
    logs.push(newLog);
    setLocal('srmss_fuel_logs', logs);
    return newLog;
  },

  async deleteFuelLog(id) {
    if (hasFirebaseConfig && db) {
      try {
        await deleteDoc(doc(db, 'fuelLogs', id));
        return id;
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    let logs = getLocal('srmss_fuel_logs');
    logs = logs.filter(l => l.id !== id);
    setLocal('srmss_fuel_logs', logs);
    return id;
  },

  // --- MAINTENANCE LOGS ---
  async getMaintenanceLogs() {
    if (hasFirebaseConfig && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'maintenanceLogs'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn("Firestore read error, reading local storage", e);
        return getLocal('srmss_maintenance_logs');
      }
    }
    return getLocal('srmss_maintenance_logs');
  },

  async addMaintenanceLog(log) {
    if (hasFirebaseConfig && db) {
      try {
        const docRef = await addDoc(collection(db, 'maintenanceLogs'), log);
        return { id: docRef.id, ...log };
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const logs = getLocal('srmss_maintenance_logs');
    const newLog = { id: 'm_' + Date.now(), ...log };
    logs.push(newLog);
    setLocal('srmss_maintenance_logs', logs);
    return newLog;
  },

  async deleteMaintenanceLog(id) {
    if (hasFirebaseConfig && db) {
      try {
        await deleteDoc(doc(db, 'maintenanceLogs', id));
        return id;
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    let logs = getLocal('srmss_maintenance_logs');
    logs = logs.filter(l => l.id !== id);
    setLocal('srmss_maintenance_logs', logs);
    return id;
  },

  // --- AUDIT LOGS ---
  async getAuditLogs() {
    if (hasFirebaseConfig && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'auditLogs'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn("Firestore read error, reading local storage", e);
        return getLocal('srmss_audit_logs');
      }
    }
    return getLocal('srmss_audit_logs');
  },

  async addAuditLog(action, details, userEmail) {
    const log = {
      action,
      details,
      userEmail,
      timestamp: new Date().toISOString()
    };
    if (hasFirebaseConfig && db) {
      try {
        await addDoc(collection(db, 'auditLogs'), log);
        return log;
      } catch (e) {
        console.warn("Firestore error, writing local storage", e);
      }
    }
    const logs = getLocal('srmss_audit_logs');
    logs.unshift({ id: 'a_' + Date.now(), ...log });
    setLocal('srmss_audit_logs', logs);
    return log;
  }
};
export default dbService;
