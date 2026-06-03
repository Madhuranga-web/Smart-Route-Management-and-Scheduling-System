import React, { useState } from 'react';
import { useDepot } from '../context/DepotContext';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { IoColorFillOutline, IoTrashOutline, IoAddOutline } from 'react-icons/io5';

export const FuelLogs = () => {
  const { fuelLogs, vehicles, addFuelLog, deleteFuelLog } = useDepot();

  const [vehicleId, setVehicleId] = useState('');
  const [fuelAmount, setFuelAmount] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculators
  const totalLitres = fuelLogs.reduce((sum, log) => sum + Number(log.fuelAmount), 0);
  const totalCost = fuelLogs.reduce((sum, log) => sum + Number(log.cost), 0);
  const averagePrice = totalLitres > 0 ? (totalCost / totalLitres).toFixed(2) : 0;

  // Sort logs by date (newest first)
  const sortedLogs = [...fuelLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalItems = sortedLogs.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstItem, indexOfLastItem);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleId || !fuelAmount || !cost || !date || !mileage) return;

    const payload = {
      vehicleId,
      fuelAmount: Number(fuelAmount),
      cost: Number(cost),
      date,
      mileage: Number(mileage)
    };

    try {
      await addFuelLog(payload);
      setVehicleId('');
      setFuelAmount('');
      setCost('');
      setMileage('');
      setShowAddForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Fuel Consumption logs</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Track refueling volumes, calculate expenditures, and monitor fleet efficiency.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 btn-primary text-xs font-bold py-2.5 shadow-md shadow-brand-500/10"
        >
          <IoAddOutline className="text-lg" />
          <span>{showAddForm ? 'Close Form' : 'Log Refueling'}</span>
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Litres */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-xl">
            <IoColorFillOutline className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Litres Consumed</p>
            <p className="text-xl font-extrabold text-slate-850 dark:text-slate-205 mt-1">{totalLitres.toFixed(1)} Litres</p>
          </div>
        </div>

        {/* Total Expenditure */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl">
            <IoColorFillOutline className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Fuel Cost</p>
            <p className="text-xl font-extrabold text-slate-850 dark:text-slate-205 mt-1">
              LKR {new Intl.NumberFormat().format(totalCost)}
            </p>
          </div>
        </div>

        {/* Avg Price per Litre */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-xl">
            <IoColorFillOutline className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Average Fuel Cost / Litre</p>
            <p className="text-xl font-extrabold text-slate-855 dark:text-slate-205 mt-1">LKR {averagePrice}</p>
          </div>
        </div>

      </div>

      {/* Expandable Add Log Form Card */}
      {showAddForm && (
        <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 animate-slide-up">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-4">
            Log New Refueling Transaction
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Vehicle *</label>
              <select
                required
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="form-input text-xs"
              >
                <option value="">-- Choose Bus --</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registrationNumber}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Fuel (Litres) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={fuelAmount}
                onChange={(e) => setFuelAmount(e.target.value)}
                placeholder="e.g. 50"
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Cost (LKR) *</label>
              <input
                type="number"
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="e.g. 17000"
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Odometer (km) *</label>
              <input
                type="number"
                required
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 185000"
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Refill Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-5 flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary text-xs"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn-primary text-xs font-bold"
              >
                Submit Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-fade">
        {totalItems > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-darkbg-900/50 text-slate-400 dark:text-slate-500 font-bold uppercase">
                  <th className="p-4">Refill Date</th>
                  <th className="p-4">Vehicle Plate</th>
                  <th className="p-4">Odometer Mileage</th>
                  <th className="p-4">Volume (Litres)</th>
                  <th className="p-4">Cost (LKR)</th>
                  <th className="p-4">Litre Cost Efficiency</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-355">
                {currentLogs.map((log) => {
                  const veh = vehicles.find(v => v.id === log.vehicleId);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-darkbg-900/30 transition">
                      <td className="p-4 font-semibold">{log.date}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-slate-200">
                        {veh ? veh.registrationNumber : <span className="text-red-400 italic">Deleted Bus</span>}
                      </td>
                      <td className="p-4 font-medium">{new Intl.NumberFormat().format(log.mileage)} km</td>
                      <td className="p-4 font-semibold">{log.fuelAmount} L</td>
                      <td className="p-4 font-bold text-slate-850 dark:text-slate-200">
                        LKR {new Intl.NumberFormat().format(log.cost)}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400">
                        LKR {(log.cost / log.fuelAmount).toFixed(2)}/L
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteFuelLog(log.id)}
                          className="p-1 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition"
                          title="Remove Log"
                        >
                          <IoTrashOutline className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Pagination */}
            <Pagination 
              currentPage={currentPage} 
              totalItems={totalItems} 
              itemsPerPage={itemsPerPage} 
              onPageChange={handlePageChange} 
            />
          </div>
        ) : (
          <EmptyState 
            title="No Refuel Logs" 
            message="No fuel records recorded in the depot logs. Click the log button above." 
            icon={IoColorFillOutline} 
          />
        )}
      </div>

    </div>
  );
};

export default FuelLogs;
