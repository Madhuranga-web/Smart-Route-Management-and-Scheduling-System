import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import { IoChevronBackOutline } from 'react-icons/io5';

export const AddDriver = () => {
  const { addDriver } = useDepot();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [workingHours, setWorkingHours] = useState('08:00 - 16:00');
  const [driverStatus, setDriverStatus] = useState('Available');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !nicNumber || !licenseNumber || !licenseExpiryDate || !phoneNumber || !email) {
      setErrorMsg("All core parameters are required.");
      return;
    }

    // Sri Lankan phone validation basic check (9-10 digits)
    if (!/^\d{9,10}$/.test(phoneNumber.replace(/[-+ ]/g, ''))) {
      setErrorMsg("Invalid phone number format. Use local format (e.g. 0771234567).");
      return;
    }

    const payload = {
      fullName,
      nicNumber,
      licenseNumber,
      licenseExpiryDate,
      phoneNumber,
      email,
      workingHours,
      driverStatus,
      assignedRoutes: []
    };

    try {
      await addDriver(payload);
      navigate('/drivers');
    } catch (err) {
      setErrorMsg("Failed to write to repository.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/drivers')}
          className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-darkbg-800 text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <IoChevronBackOutline className="text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Register Operator</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Enroll new personnel, record credentials, and establish shift schedules.</p>
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
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priyantha Jayasuriya"
                className="form-input text-sm"
              />
            </div>

            {/* NIC Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">National Identity Card (NIC) *</label>
              <input
                type="text"
                required
                value={nicNumber}
                onChange={(e) => setNicNumber(e.target.value)}
                placeholder="e.g. 198901234567 or 890123456V"
                className="form-input text-sm"
              />
            </div>

            {/* License Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Heavy License Number *</label>
              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. B8765432"
                className="form-input text-sm font-mono"
              />
            </div>

            {/* License Expiry */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">License Expiry Date *</label>
              <input
                type="date"
                required
                value={licenseExpiryDate}
                onChange={(e) => setLicenseExpiryDate(e.target.value)}
                className="form-input text-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Phone Number *</label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 0771234567"
                className="form-input text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. p.jayasuriya@srmss.lk"
                className="form-input text-sm"
              />
            </div>

            {/* Working Hours */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Shift Schedule</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="e.g. 06:00 - 14:00"
                className="form-input text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase mb-2">Initial Status</label>
              <select
                value={driverStatus}
                onChange={(e) => setDriverStatus(e.target.value)}
                className="form-input text-sm"
              >
                <option value="Available">Available</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-750">
            <button
              type="button"
              onClick={() => navigate('/drivers')}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs font-bold"
            >
              Save Driver
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AddDriver;
