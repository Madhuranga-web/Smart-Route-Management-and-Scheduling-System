import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import { IoChevronBackOutline, IoSaveOutline, IoCreateOutline, IoBuildOutline, IoColorFillOutline, IoCalendarOutline } from 'react-icons/io5';

export const VehicleDetails = () => {
  const { id } = useParams();
  const { vehicles, updateVehicle, maintenanceLogs, fuelLogs } = useDepot();
  const navigate = useNavigate();

  const vehicle = vehicles.find(v => v.id === id);

  const [editMode, setEditMode] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('Diesel');
  const [vehicleStatus, setVehicleStatus] = useState('Available');
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');

  useEffect(() => {
    if (vehicle) {
      setRegistrationNumber(vehicle.registrationNumber);
      setVehicleType(vehicle.vehicleType);
      setSeatingCapacity(vehicle.seatingCapacity);
      setMileage(vehicle.mileage);
      setFuelType(vehicle.fuelType);
      setVehicleStatus(vehicle.vehicleStatus);
      setLastServiceDate(vehicle.lastServiceDate || '');
      setNextServiceDate(vehicle.nextServiceDate || '');
    }
  }, [vehicle]);

  if (!vehicle) {
    return (
      <div className="bg-white dark:bg-darkbg-800 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
        <h3 className="text-lg font-bold text-red-650">Vehicle not found</h3>
        <button onClick={() => navigate('/vehicles')} className="btn-primary mt-4">
          Back to Vehicles
        </button>
      </div>
    );
  }

  // Filter logs for this specific vehicle
  const historyMaintenance = maintenanceLogs.filter(m => m.vehicleId === vehicle.id);
  const historyFuel = fuelLogs.filter(f => f.vehicleId === vehicle.id);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      registrationNumber,
      vehicleType,
      seatingCapacity: Number(seatingCapacity),
      mileage: Number(mileage),
      fuelType,
      vehicleStatus,
      lastServiceDate,
      nextServiceDate
    };

    try {
      await updateVehicle(vehicle.id, payload);
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
            onClick={() => navigate('/vehicles')}
            className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-darkbg-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <IoChevronBackOutline className="text-lg" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Vehicle Specifications</h1>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">{vehicle.registrationNumber} &bull; Specifications & Logs</p>
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
              <span>Edit Asset</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Specs Details Card */}
        <div className="lg:col-span-2 bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          {!editMode ? (
            // Read-Only Layout
            <div className="space-y-6">
              <div className="flex items-center space-x-4 border-b border-slate-100 dark:border-slate-700 pb-5">
                <div className="h-16 w-16 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center text-3xl">
                  <IoBusOutline />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">{vehicle.registrationNumber}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Depot Fleet ID: {vehicle.id}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs">
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Vehicle Classification</p>
                  <p className="font-semibold text-slate-750 dark:text-slate-200 mt-1">{vehicle.vehicleType}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Seating Capacity</p>
                  <p className="font-semibold text-slate-755 dark:text-slate-200 mt-1">{vehicle.seatingCapacity} Passengers</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Odometer Mileage</p>
                  <p className="font-semibold text-slate-750 dark:text-slate-200 mt-1">{new Intl.NumberFormat().format(vehicle.mileage)} km</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Fuel Combustion Category</p>
                  <p className="font-semibold text-slate-750 dark:text-slate-200 mt-1">{vehicle.fuelType}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Last Main Service</p>
                  <p className="font-semibold text-slate-750 dark:text-slate-200 mt-1">{vehicle.lastServiceDate || 'None logged'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Next Preventive Service</p>
                  <p className="font-semibold text-slate-755 dark:text-slate-200 mt-1">{vehicle.nextServiceDate || 'None scheduled'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wide">Depot Operational Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[9px] mt-1 ${
                    vehicle.vehicleStatus === 'Available' ? 'bg-emerald-50 text-emerald-700' : vehicle.vehicleStatus === 'On Route' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {vehicle.vehicleStatus}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode Form Layout
            <form onSubmit={handleUpdate} className="space-y-6">
              <h3 className="text-sm font-bold text-slate-805 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-3">
                Edit Fleet Specifications
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Plate Number</label>
                  <input type="text" required value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="form-input text-xs" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Vehicle Type</label>
                  <input type="text" required value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="form-input text-xs" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Seating Capacity</label>
                  <input type="number" required value={seatingCapacity} onChange={(e) => setSeatingCapacity(e.target.value)} className="form-input text-xs" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Mileage (km)</label>
                  <input type="number" required value={mileage} onChange={(e) => setMileage(e.target.value)} className="form-input text-xs" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Fuel Type</label>
                  <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="form-input text-xs">
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Operation Status</label>
                  <select value={vehicleStatus} onChange={(e) => setVehicleStatus(e.target.value)} className="form-input text-xs">
                    <option value="Available">Available</option>
                    <option value="On Route">On Route</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Last Service Date</label>
                  <input type="date" value={lastServiceDate} onChange={(e) => setLastServiceDate(e.target.value)} className="form-input text-xs" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Next Service Date</label>
                  <input type="date" value={nextServiceDate} onChange={(e) => setNextServiceDate(e.target.value)} className="form-input text-xs" />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setEditMode(false)} className="btn-secondary text-xs">Cancel</button>
                <button type="submit" className="flex items-center space-x-1.5 btn-primary text-xs font-bold">
                  <IoSaveOutline />
                  <span>Save Specs</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Mini Panels */}
        <div className="space-y-6">
          
          {/* Maintenance logs snippet */}
          <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center space-x-2">
              <IoBuildOutline className="text-base text-brand-500" />
              <span>Service Logs</span>
            </h4>
            {historyMaintenance.length > 0 ? (
              <div className="space-y-2.5 max-h-52 overflow-y-auto">
                {historyMaintenance.map(m => (
                  <div key={m.id} className="p-2.5 bg-slate-50 dark:bg-darkbg-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-750 dark:text-slate-350">
                      <span>{m.serviceType}</span>
                      <span className="text-[10px] text-slate-400">{m.serviceDate}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">{m.description}</p>
                    <p className="text-[9px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                      Cost: LKR {new Intl.NumberFormat().format(m.cost)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No maintenance records registered for this bus.</p>
            )}
          </div>

          {/* Refuel Logs snippet */}
          <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center space-x-2">
              <IoColorFillOutline className="text-base text-amber-500" />
              <span>Refuels History</span>
            </h4>
            {historyFuel.length > 0 ? (
              <div className="space-y-2.5 max-h-52 overflow-y-auto">
                {historyFuel.map(f => (
                  <div key={f.id} className="p-2.5 bg-slate-50 dark:bg-darkbg-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-300">{f.fuelAmount} Litres</p>
                      <p className="text-[10px] text-slate-400">{f.date} &bull; Odo: {f.mileage} km</p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      LKR {new Intl.NumberFormat().format(f.cost)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No fuel logs registered for this bus.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default VehicleDetails;
