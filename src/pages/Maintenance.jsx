import React, { useState } from 'react';
import { useDepot } from '../context/DepotContext';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { IoBuildOutline, IoTrashOutline, IoAddOutline, IoTimeOutline, IoWalletOutline } from 'react-icons/io5';

export const Maintenance = () => {
  const { maintenanceLogs, vehicles, addMaintenanceLog, deleteMaintenanceLog } = useDepot();

  const [vehicleId, setVehicleId] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [cost, setCost] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [description, setDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculators
  const totalServiceCost = maintenanceLogs.reduce((sum, log) => sum + Number(log.cost), 0);
  const activeMaintenanceCount = vehicles.filter(v => v.vehicleStatus === 'Maintenance').length;

  // Sort logs by date (newest first)
  const sortedLogs = [...maintenanceLogs].sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));

  const totalItems = sortedLogs.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstItem, indexOfLastItem);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleId || !serviceType || !cost || !serviceDate || !nextServiceDate || !description) return;

    const payload = {
      vehicleId,
      serviceType,
      cost: Number(cost),
      serviceDate,
      nextServiceDate,
      description
    };

    try {
      await addMaintenanceLog(payload);
      setVehicleId('');
      setServiceType('');
      setCost('');
      setNextServiceDate('');
      setDescription('');
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
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Maintenance & Service logs</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Record workshop details, calculate repair costs, and track scheduling for vehicle servicing.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 btn-primary text-xs font-bold py-2.5 shadow-md shadow-brand-500/10"
        >
          <IoAddOutline className="text-lg" />
          <span>{showAddForm ? 'Close Form' : 'Log Maintenance'}</span>
        </button>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Maintenance Cost */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-xl">
            <IoWalletOutline className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Servicing Costs</p>
            <p className="text-xl font-extrabold text-slate-855 dark:text-slate-205 mt-1">
              LKR {new Intl.NumberFormat().format(totalServiceCost)}
            </p>
          </div>
        </div>

        {/* Active Maintenance */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-xl">
            <IoBuildOutline className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Buses in Workshop</p>
            <p className="text-xl font-extrabold text-slate-855 dark:text-slate-205 mt-1">{activeMaintenanceCount} Vehicles</p>
          </div>
        </div>

        {/* Reminders scheduled */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-xl">
            <IoTimeOutline className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Completed Service Tickets</p>
            <p className="text-xl font-extrabold text-slate-855 dark:text-slate-205 mt-1">{maintenanceLogs.length} Tickets</p>
          </div>
        </div>

      </div>

      {/* Expandable Form Panel */}
      {showAddForm && (
        <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 animate-slide-up">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-4">
            Log Workshop / Service Event
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Service Type / Task *</label>
                <input
                  type="text"
                  required
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="e.g. Brake Pads Replacement"
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
                  placeholder="e.g. 15000"
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Service Date *</label>
                <input
                  type="date"
                  required
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Next Service Due *</label>
                <input
                  type="date"
                  required
                  value={nextServiceDate}
                  onChange={(e) => setNextServiceDate(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Task details & Description *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Replaced front brake pad calipers, adjusted alignment..."
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-700">
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
                Log Service
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
                  <th className="p-4">Service Date</th>
                  <th className="p-4">Vehicle Plate</th>
                  <th className="p-4">Service Type</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Cost (LKR)</th>
                  <th className="p-4">Next Due Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-355">
                {currentLogs.map((log) => {
                  const veh = vehicles.find(v => v.id === log.vehicleId);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-darkbg-900/30 transition">
                      <td className="p-4 font-semibold">{log.serviceDate}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-slate-200">
                        {veh ? veh.registrationNumber : <span className="text-red-400 italic">Deleted Bus</span>}
                      </td>
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{log.serviceType}</td>
                      <td className="p-4 max-w-xs truncate text-slate-500 dark:text-slate-400" title={log.description}>
                        {log.description}
                      </td>
                      <td className="p-4 font-bold text-slate-850 dark:text-slate-200">
                        LKR {new Intl.NumberFormat().format(log.cost)}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-405">{log.nextServiceDate}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteMaintenanceLog(log.id)}
                          className="p-1 text-red-655 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition"
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
            title="No Service Logs" 
            message="No maintenance records found. Log workshop entries above." 
            icon={IoBuildOutline} 
          />
        )}
      </div>

    </div>
  );
};

export default Maintenance;
