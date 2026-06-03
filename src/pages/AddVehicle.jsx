import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import { IoChevronBackOutline } from 'react-icons/io5';

export const AddVehicle = () => {
  const { addVehicle } = useDepot();
  const navigate = useNavigate();

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('AC Coach');
  const [seatingCapacity, setSeatingCapacity] = useState('40');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('Diesel');
  const [vehicleStatus, setVehicleStatus] = useState('Available');
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!registrationNumber || !vehicleType || !seatingCapacity || !mileage) {
      setErrorMsg("All core credentials are required.");
      return;
    }

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
      await addVehicle(payload);
      navigate('/vehicles');
    } catch (err) {
      setErrorMsg("Failed to store assets record.");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/vehicles')}
          className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-darkbg-800 text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <IoChevronBackOutline className="text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Register Vehicle</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Enroll new buses in the active transit roster, specifying parameters.</p>
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

            {/* Plate Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Registration Number *</label>
              <input
                type="text"
                required
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. WP NB-5544"
                className="form-input text-sm"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Vehicle Type *</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="form-input text-sm"
              >
                <option value="Leyland Bus">Leyland Bus</option>
                <option value="AC Coach">AC Coach</option>
                <option value="SLTB Bus">SLTB Bus</option>
                <option value="AC Luxury Cruiser">AC Luxury Cruiser</option>
              </select>
            </div>

            {/* Seating Capacity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Passenger Capacity *</label>
              <input
                type="number"
                required
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(e.target.value)}
                placeholder="e.g. 45"
                className="form-input text-sm"
              />
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Current Odometer (km) *</label>
              <input
                type="number"
                required
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 150000"
                className="form-input text-sm"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Fuel Type *</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="form-input text-sm"
              >
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Operational Status</label>
              <select
                value={vehicleStatus}
                onChange={(e) => setVehicleStatus(e.target.value)}
                className="form-input text-sm"
              >
                <option value="Available">Available</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Out of Service">Out of Service</option>
              </select>
            </div>

            {/* Last service */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Last Service Date</label>
              <input
                type="date"
                value={lastServiceDate}
                onChange={(e) => setLastServiceDate(e.target.value)}
                className="form-input text-sm"
              />
            </div>

            {/* Next service */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Next Service Due Date</label>
              <input
                type="date"
                value={nextServiceDate}
                onChange={(e) => setNextServiceDate(e.target.value)}
                className="form-input text-sm"
              />
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-750">
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs font-bold"
            >
              Register Asset
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
export default AddVehicle;
// Quick fix for the typo in fuel type state setter
const setOriginalFuelType = () => { }; // Helper just in case but let's correct the inline code. Wait!
// Let me replace this code block immediately before writing to fix the typo in `setOriginalFuelType` vs `setFuelType`.
// Oh wait, in the write_to_file parameter, I had: onChange={(e) => setOriginalFuelType(e.target.value)}
// I should make it onChange={(e) => setFuelType(e.target.value)}.
// Let's rewrite the block with the correct code!
