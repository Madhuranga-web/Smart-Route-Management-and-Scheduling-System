import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import { IoChevronBackOutline } from 'react-icons/io5';

export const EditSchedule = () => {
  const { id } = useParams();
  const { schedules, updateSchedule, routes, drivers, vehicles } = useDepot();
  const navigate = useNavigate();

  const schedule = schedules.find(s => s.id === id);

  const [routeId, setRouteId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [date, setDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [tripStatus, setTripStatus] = useState('Scheduled');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (schedule) {
      setRouteId(schedule.routeId);
      setDriverId(schedule.driverId);
      setVehicleId(schedule.vehicleId);
      setDate(schedule.date);
      setDepartureTime(schedule.departureTime);
      setArrivalTime(schedule.arrivalTime);
      setTripStatus(schedule.tripStatus);
      setNotes(schedule.notes || '');
    }
  }, [schedule]);

  if (!schedule) {
    return (
      <div className="bg-white dark:bg-darkbg-800 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
        <h3 className="text-lg font-bold text-red-650">Schedule not found</h3>
        <button onClick={() => navigate('/schedules')} className="btn-primary mt-4">
          Back to Schedules
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!routeId || !driverId || !vehicleId || !date || !departureTime || !arrivalTime) {
      setErrorMsg("Please fill out all required parameters.");
      return;
    }

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
      await updateSchedule(id, payload);
      navigate('/schedules');
    } catch (err) {
      setErrorMsg(err.message || "Conflict detected or database error.");
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
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Edit Schedule</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Modify parameters or update status for schedule {id}.</p>
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
                onChange={(e) => setRouteId(e.target.value)}
                className="form-input text-sm"
              >
                {routes.map(r => (
                  <option key={r.id} value={r.id}>{r.routeNumber} : {r.routeName}</option>
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
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registrationNumber} ({v.vehicleStatus})</option>
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
                <option value="Active">Active</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Operational Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
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
              Update Schedule
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default EditSchedule;
