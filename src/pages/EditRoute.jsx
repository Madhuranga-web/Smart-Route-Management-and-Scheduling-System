import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import { CITY_COORDS } from '../components/RouteMap';
import { IoChevronBackOutline, IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

export const EditRoute = () => {
  const { id } = useParams();
  const { routes, updateRoute, drivers, vehicles } = useDepot();
  const navigate = useNavigate();

  const route = routes.find(r => r.id === id);

  const [routeName, setRouteName] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [stops, setStops] = useState([]);
  const [totalDistance, setTotalDistance] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [assignedDriver, setAssignedDriver] = useState('');
  const [assignedVehicle, setAssignedVehicle] = useState('');

  const cityOptions = Object.keys(CITY_COORDS);

  useEffect(() => {
    if (route) {
      setRouteName(route.routeName);
      setRouteNumber(route.routeNumber);
      setStartLocation(route.startLocation);
      setEndLocation(route.endLocation);
      setStops(route.intermediaryStops || []);
      setTotalDistance(route.totalDistance);
      setEstimatedDuration(route.estimatedDuration);
      setAssignedDriver(route.assignedDriver || '');
      setAssignedVehicle(route.assignedVehicle || '');
    }
  }, [route]);

  if (!route) {
    return (
      <div className="bg-white dark:bg-darkbg-800 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
        <h3 className="text-lg font-bold text-red-650">Route not found</h3>
        <button onClick={() => navigate('/routes')} className="btn-primary mt-4">
          Back to Routes
        </button>
      </div>
    );
  }

  const handleAddStop = () => {
    setStops(prev => [...prev, 'Colombo Fort']);
  };

  const handleRemoveStop = (index) => {
    setStops(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleStopChange = (index, value) => {
    setStops(prev => prev.map((s, idx) => idx === index ? value : s));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!routeName || !routeNumber || !totalDistance || !estimatedDuration) return;

    const payload = {
      routeName,
      routeNumber,
      startLocation,
      endLocation,
      intermediaryStops: stops,
      totalDistance: Number(totalDistance),
      estimatedDuration,
      assignedDriver,
      assignedVehicle
    };

    try {
      await updateRoute(id, payload);
      navigate('/routes');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/routes')}
          className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-darkbg-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <IoChevronBackOutline className="text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Edit Route</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Modify properties of route line {route.routeNumber}.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 max-w-4xl animate-fade">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Route Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Route Name</label>
              <input
                type="text"
                required
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="e.g. Colombo - Galle Express"
                className="form-input text-sm"
              />
            </div>

            {/* Route Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Route Code / Number</label>
              <input
                type="text"
                required
                value={routeNumber}
                onChange={(e) => setRouteNumber(e.target.value)}
                placeholder="e.g. EX-002"
                className="form-input text-sm"
              />
            </div>

            {/* Start Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Start Terminus</label>
              <select
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="form-input text-sm"
              >
                {cityOptions.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* End Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">End Terminus</label>
              <select
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                className="form-input text-sm"
              >
                {cityOptions.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Total Distance */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Total Distance (km)</label>
              <input
                type="number"
                required
                value={totalDistance}
                onChange={(e) => setTotalDistance(e.target.value)}
                className="form-input text-sm"
              />
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Estimated Duration</label>
              <input
                type="text"
                required
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="form-input text-sm"
              />
            </div>

            {/* Assigned Driver */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Default Driver</label>
              <select
                value={assignedDriver}
                onChange={(e) => setAssignedDriver(e.target.value)}
                className="form-input text-sm"
              >
                <option value="">-- Assign Driver --</option>
                {drivers.map(drv => (
                  <option key={drv.id} value={drv.fullName}>{drv.fullName} ({drv.driverStatus})</option>
                ))}
              </select>
            </div>

            {/* Assigned Vehicle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Default Vehicle</label>
              <select
                value={assignedVehicle}
                onChange={(e) => setAssignedVehicle(e.target.value)}
                className="form-input text-sm"
              >
                <option value="">-- Assign Bus --</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.registrationNumber}>{v.registrationNumber} ({v.vehicleType})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Intermediary stops divider */}
          <div className="border-t border-slate-100 dark:border-slate-750 pt-5 space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase">
                Intermediary stops / stations
              </label>
              <button
                type="button"
                onClick={handleAddStop}
                className="flex items-center space-x-1.5 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-350 font-bold transition"
              >
                <IoAddCircleOutline className="text-base" />
                <span>Add Stop</span>
              </button>
            </div>

            {stops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-slate-50 dark:bg-darkbg-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 dark:bg-slate-850 px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <select
                      value={stop}
                      onChange={(e) => handleStopChange(idx, e.target.value)}
                      className="flex-1 bg-transparent border-none text-slate-805 dark:text-slate-100 text-sm focus:outline-none"
                    >
                      {cityOptions.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(idx)}
                      className="text-red-500 hover:text-red-650 transition"
                    >
                      <IoRemoveCircleOutline className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No intermediary stops added. Direct terminus run.</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-750">
            <button
              type="button"
              onClick={() => navigate('/routes')}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs font-bold"
            >
              Update Route
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default EditRoute;
