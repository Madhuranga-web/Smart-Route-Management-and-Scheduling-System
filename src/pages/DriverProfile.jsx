import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import { IoChevronBackOutline, IoSaveOutline, IoCreateOutline, IoCalendarOutline, IoAlertCircleOutline } from 'react-icons/io5';

export const DriverProfile = () => {
  const { id } = useParams();
  const { drivers, updateDriver, schedules, routes } = useDepot();
  const navigate = useNavigate();

  const driver = drivers.find(d => d.id === id);

  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [driverStatus, setDriverStatus] = useState('Available');

  useEffect(() => {
    if (driver) {
      setFullName(driver.fullName);
      setNicNumber(driver.nicNumber);
      setLicenseNumber(driver.licenseNumber);
      setLicenseExpiryDate(driver.licenseExpiryDate);
      setPhoneNumber(driver.phoneNumber);
      setEmail(driver.email);
      setWorkingHours(driver.workingHours);
      setDriverStatus(driver.driverStatus);
    }
  }, [driver]);

  if (!driver) {
    return (
      <div className="bg-white dark:bg-darkbg-800 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
        <h3 className="text-lg font-bold text-red-650">Driver profile not found</h3>
        <button onClick={() => navigate('/drivers')} className="btn-primary mt-4">
          Back to Drivers
        </button>
      </div>
    );
  }

  // Filter schedules assigned to this driver
  const driverSchedules = schedules.filter(s => s.driverId === driver.id);

  // Check license alerts
  const today = new Date();
  const expiry = new Date(driver.licenseExpiryDate);
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  const isExpired = diffDays < 0;
  const isExpiringSoon = diffDays >= 0 && diffDays <= 30;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      fullName,
      nicNumber,
      licenseNumber,
      licenseExpiryDate,
      phoneNumber,
      email,
      workingHours,
      driverStatus,
      assignedRoutes: driver.assignedRoutes || []
    };

    try {
      await updateDriver(driver.id, payload);
      setEditMode(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/drivers')}
            className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-darkbg-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <IoChevronBackOutline className="text-lg" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Driver Profile</h1>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">{driver.fullName} &bull; Details and Assignments</p>
          </div>
        </div>

        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
            editMode 
              ? 'bg-slate-200 text-slate-800 dark:bg-slate-750 dark:text-slate-200' 
              : 'bg-brand-600 text-white hover:bg-brand-700'
          }`}
        >
          {editMode ? (
            <span>Cancel Edit</span>
          ) : (
            <>
              <IoCreateOutline className="text-base" />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>

      {/* License Warning Banners */}
      {isExpired && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-xl text-xs text-red-800 dark:text-red-400 font-semibold flex items-center space-x-2 animate-pulse">
          <IoAlertCircleOutline className="text-lg flex-shrink-0" />
          <span>CRITICAL: License has expired! This operator must be suspended from active trips immediately.</span>
        </div>
      )}
      {isExpiringSoon && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-xl text-xs text-amber-800 dark:text-amber-400 font-semibold flex items-center space-x-2">
          <IoAlertCircleOutline className="text-lg flex-shrink-0" />
          <span>ATTENTION: License expires in {diffDays} days ({driver.licenseExpiryDate}). Schedule renewal procedures.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card & Info View/Edit */}
        <div className="lg:col-span-2 bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          {!editMode ? (
            // Read-Only Layout
            <div className="space-y-6">
              <div className="flex items-center space-x-4 border-b border-slate-100 dark:border-slate-700 pb-5">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-bold text-2xl flex items-center justify-center">
                  {driver.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{driver.fullName}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Depot Operator ID: {driver.id}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs">
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">NIC Number</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 mt-1">{driver.nicNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">License Number</p>
                  <p className="font-semibold text-slate-750 dark:text-slate-200 font-mono mt-1">{driver.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">License Expiration</p>
                  <p className="font-semibold text-slate-750 dark:text-slate-200 mt-1">{driver.licenseExpiryDate}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Phone Number</p>
                  <p className="font-semibold text-slate-750 dark:text-slate-200 mt-1">{driver.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Email Address</p>
                  <p className="font-semibold text-slate-750 dark:text-slate-200 mt-1">{driver.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Working Hours</p>
                  <p className="font-semibold text-slate-750 dark:text-slate-200 mt-1">{driver.workingHours}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Duty Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[9px] mt-1 ${
                    driver.driverStatus === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {driver.driverStatus}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode Form Layout
            <form onSubmit={handleUpdate} className="space-y-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-3">
                Edit Operator Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input text-xs" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">NIC Number</label>
                  <input type="text" required value={nicNumber} onChange={(e) => setNicNumber(e.target.value)} className="form-input text-xs" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">License Number</label>
                  <input type="text" required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="form-input text-xs" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">License Expiry Date</label>
                  <input type="date" required value={licenseExpiryDate} onChange={(e) => setLicenseExpiryDate(e.target.value)} className="form-input text-xs" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                  <input type="text" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="form-input text-xs" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input text-xs" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Working Hours Shifts</label>
                  <input type="text" placeholder="e.g. 08:00 - 16:00" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} className="form-input text-xs" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Duty Status</label>
                  <select value={driverStatus} onChange={(e) => setDriverStatus(e.target.value)} className="form-input text-xs">
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setEditMode(false)} className="btn-secondary text-xs">Cancel</button>
                <button type="submit" className="flex items-center space-x-1.5 btn-primary text-xs font-bold">
                  <IoSaveOutline />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Driver Schedule Logs */}
        <div className="lg:col-span-1 bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
            Assigned Trip Log
          </h3>

          {driverSchedules.length > 0 ? (
            <div className="space-y-3.5 overflow-y-auto max-h-96">
              {driverSchedules.map((s) => {
                const route = routes.find(r => r.id === s.routeId);
                return (
                  <div key={s.id} className="p-3 bg-slate-50 dark:bg-darkbg-900 border border-slate-100 dark:border-slate-800 rounded-lg space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1">
                        <IoCalendarOutline />
                        <span>{s.date}</span>
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-extrabold capitalize ${
                        s.tripStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {s.tripStatus}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-750 dark:text-slate-250 truncate">
                      {route?.routeName || "Route Details"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      Shift: {s.departureTime} - {s.arrivalTime}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-750 rounded-lg">
              <IoCalendarOutline className="text-3xl text-slate-300 dark:text-slate-650 mb-2" />
              <p className="text-xs text-slate-400 italic">No assigned schedules.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DriverProfile;
