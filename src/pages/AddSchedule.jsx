import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import { IoChevronBackOutline } from 'react-icons/io5';

export const AddSchedule = () => {
  const { addSchedule, routes, drivers, vehicles } = useDepot();
  const navigate = useNavigate();

  const [routeId, setRouteId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [date, setDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [tripStatus, setTripStatus] = useState('Scheduled');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle route change to pre-assign default driver/vehicle if possible
  const handleRouteChange = (rId) => {
    setRouteId(rId);
    const selectedRoute = routes.find(r => r.id === rId);
    if (selectedRoute) {
      // Find matching driver by name
      const matchingDrv = drivers.find(d => d.fullName === selectedRoute.assignedDriver);
      if (matchingDrv) setDriverId(matchingDrv.id);

      // Find matching vehicle by registration number
      const matchingVeh = vehicles.find(v => v.registrationNumber === selectedRoute.assignedVehicle);
      if (matchingVeh) setVehicleId(matchingVeh.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!routeId || !driverId || !vehicleId || !date || !departureTime || !arrivalTime) {
      setErrorMsg("Please fill out all required assignment parameters.");
      return;
    }

    // Basic time ordering validation
    if (departureTime >= arrivalTime) {
      setErrorMsg("Arrival time must be later than departure time.");
      return;
    }

    const payload = {
      routeId,
      driverId,
      vehicleId,
      date,
      departureTime,
      arrivalTime,
      tripStatus,
      notes
    };

    try {
      await addSchedule(payload);
      navigate('/schedules');
    } catch (err) {
      setErrorMsg(err.message || "Conflict detected or transaction failed.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/schedules')}
          className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-darkbg-800 text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <IoChevronBackOutline className="text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Create Trip Schedule</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Define departure windows, assign operators, and verify resource availability.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 max-w-3xl animate-fade">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded text-xs text-red-750 dark:text-red-400 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Route Selector */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Transit Route *</label>
              <select
                required
                value={routeId}
                onChange={(e) => handleRouteChange(e.target.value)}
                className="form-input text-sm"
              >
                <option value="">-- Choose Route --</option>
                {routes.map(r => (
                  <option key={r.id} value={r.id}>{r.routeNumber} : {r.routeName} ({r.totalDistance} km)</option>
                ))}
              </select>
            </div>

            {/* Driver Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Assigned Driver *</label>
              <select
                required
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="form-input text-sm"
              >
                <option value="">-- Select Operator --</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.fullName} ({d.driverStatus})</option>
                ))}
              </select>
            </div>

            {/* Vehicle Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Fleet Vehicle / Bus *</label>
              <select
                required
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="form-input text-sm"
              >
                <option value="">-- Choose Bus --</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registrationNumber} - {v.vehicleType} ({v.vehicleStatus})</option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Departure Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input text-sm"
              />
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Trip Status *</label>
              <select
                value={tripStatus}
                onChange={(e) => setTripStatus(e.target.value)}
                className="form-input text-sm"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Active">Active (On the road)</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Departure Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Departure Time *</label>
              <input
                type="time"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="form-input text-sm"
              />
            </div>

            {/* Arrival Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Expected Arrival Time *</label>
              <input
                type="time"
                required
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="form-input text-sm"
              />
            </div>

            {/* Operational Notes */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Operational Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Specify highway instructions, weather alerts, or checkpoint notes..."
                className="form-input text-sm"
              />
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-750">
            <button
              type="button"
              onClick={() => navigate('/schedules')}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs font-bold"
            >
              Verify & Save Schedule
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AddSchedule;
