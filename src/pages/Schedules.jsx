import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';
import { FilterDropdown } from '../components/FilterDropdown';
import { EmptyState } from '../components/EmptyState';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  IoAddOutline, 
  IoCalendarOutline, 
  IoPlayCircleOutline, 
  IoCheckmarkCircleOutline, 
  IoAlertCircleOutline,
  IoCloseCircleOutline,
  IoCreateOutline,
  IoTrashOutline
} from 'react-icons/io5';

export const Schedules = () => {
  const { schedules, routes, vehicles, drivers, updateSchedule, deleteSchedule } = useDepot();
  const navigate = useNavigate();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Deletion Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  // Status mapping colors
  const statusStyles = {
    Scheduled: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
    Active: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
    Delayed: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    Completed: 'bg-emerald-50 text-emerald-750 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-800',
    Cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
  };

  // Helper resolvers
  const getRouteInfo = (routeId) => routes.find(r => r.id === routeId);
  const getVehicleInfo = (vehicleId) => vehicles.find(v => v.id === vehicleId);
  const getDriverInfo = (driverId) => drivers.find(d => d.id === driverId);

  // Filter schedules
  const filteredSchedules = schedules.filter(s => {
    const route = getRouteInfo(s.routeId);
    const driver = getDriverInfo(s.driverId);
    const vehicle = getVehicleInfo(s.vehicleId);

    const matchesSearch = 
      (route?.routeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle?.registrationNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || s.tripStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort by date and time (most recent/future first)
  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.departureTime}`);
    const dateB = new Date(`${b.date}T${b.departureTime}`);
    return dateB - dateA;
  });

  // Pagination bounds
  const totalItems = sortedSchedules.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = sortedSchedules.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const handleStatusChange = async (schedule, nextStatus) => {
    try {
      const payload = { ...schedule, tripStatus: nextStatus };
      if (nextStatus === 'Delayed') {
        payload.notes = "Trip delayed due to road traffic/operations. " + (schedule.notes || '');
      }
      await updateSchedule(schedule.id, payload);
    } catch (e) {
      // toast shown in context
    }
  };

  const openDeleteModal = (sch) => {
    setScheduleToDelete(sch);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (scheduleToDelete) {
      await deleteSchedule(scheduleToDelete.id);
      setScheduleToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Schedule Management</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Control daily departure plans, track trips, and resolve scheduling log conflicts.</p>
        </div>
        <button
          onClick={() => navigate('/schedules/add')}
          className="flex items-center space-x-1.5 btn-primary text-xs font-bold shadow-md shadow-brand-500/10 py-2.5"
        >
          <IoAddOutline className="text-lg" />
          <span>Add New Schedule</span>
        </button>
      </div>

      {/* Query Filters Bar */}
      <div className="bg-white dark:bg-darkbg-800 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4">
        <SearchBar 
          value={searchTerm} 
          onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} 
          placeholder="Search route, driver, bus..." 
        />
        
        <FilterDropdown 
          value={filterStatus} 
          onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }} 
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Scheduled', value: 'Scheduled' },
            { label: 'Active', value: 'Active' },
            { label: 'Delayed', value: 'Delayed' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Cancelled', value: 'Cancelled' }
          ]} 
          label="Filter Status"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-fade">
        {totalItems > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-darkbg-900/50 text-slate-400 dark:text-slate-500 font-bold uppercase">
                  <th className="p-4">Date</th>
                  <th className="p-4">Time Window</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Driver</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4 text-right">Quick Status Action</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-350">
                {currentSchedules.map((s) => {
                  const r = getRouteInfo(s.routeId);
                  const v = getVehicleInfo(s.vehicleId);
                  const d = getDriverInfo(s.driverId);
                  
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-darkbg-900/30 transition">
                      <td className="p-4 font-semibold">{s.date}</td>
                      <td className="p-4 font-medium">
                        <span className="text-slate-850 dark:text-slate-200">{s.departureTime}</span> 
                        <span className="text-slate-400 px-1">&rarr;</span> 
                        <span className="text-slate-500 dark:text-slate-400">{s.arrivalTime}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-850 dark:text-slate-200">
                          {r ? r.routeName : <span className="text-red-400">Route Deleted</span>}
                        </div>
                        <div className="text-[10px] text-slate-400">Code: {r?.routeNumber}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                        {v ? v.registrationNumber : <span className="text-red-400">Bus Deleted</span>}
                      </td>
                      <td className="p-4 text-slate-550 dark:text-slate-450">
                        {d ? d.fullName : <span className="text-red-400">Driver Deleted</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${statusStyles[s.tripStatus] || ''}`}>
                          {s.tripStatus}
                        </span>
                      </td>
                      <td className="p-4 max-w-[150px] truncate text-slate-400" title={s.notes}>
                        {s.notes || <span className="italic text-slate-300">-</span>}
                      </td>
                      
                      {/* Quick status transitions */}
                      <td className="p-4 text-right">
                        <div className="flex space-x-1 justify-end">
                          {s.tripStatus === 'Scheduled' && (
                            <button
                              onClick={() => handleStatusChange(s, 'Active')}
                              className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded transition"
                              title="Start Trip (Active)"
                            >
                              <IoPlayCircleOutline className="text-lg" />
                            </button>
                          )}
                          {(s.tripStatus === 'Active' || s.tripStatus === 'Scheduled') && (
                            <button
                              onClick={() => handleStatusChange(s, 'Delayed')}
                              className="p-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded transition"
                              title="Mark Delayed"
                            >
                              <IoAlertCircleOutline className="text-lg" />
                            </button>
                          )}
                          {(s.tripStatus === 'Active' || s.tripStatus === 'Delayed') && (
                            <button
                              onClick={() => handleStatusChange(s, 'Completed')}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded transition"
                              title="Complete Trip"
                            >
                              <IoCheckmarkCircleOutline className="text-lg" />
                            </button>
                          )}
                          {s.tripStatus !== 'Cancelled' && s.tripStatus !== 'Completed' && (
                            <button
                              onClick={() => handleStatusChange(s, 'Cancelled')}
                              className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
                              title="Cancel Trip"
                            >
                              <IoCloseCircleOutline className="text-lg" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Edit/Delete Actions */}
                      <td className="p-4 text-right flex space-x-1 justify-end">
                        <button
                          onClick={() => navigate(`/schedules/edit/${s.id}`)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-550 dark:text-slate-350 rounded transition"
                          title="Edit Schedule"
                        >
                          <IoCreateOutline className="text-base" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(s)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 rounded transition"
                          title="Delete Schedule"
                        >
                          <IoTrashOutline className="text-base" />
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
            title="No Schedules Found" 
            message="No trip schedules align with search terms. Select another filter category." 
            icon={IoCalendarOutline} 
          />
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        title="Remove Schedule" 
        message="Are you sure you want to delete this trip schedule from the log? This cannot be undone." 
      />

    </div>
  );
};

export default Schedules;
