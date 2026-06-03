import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { IoAddOutline, IoBusOutline, IoEyeOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';

export const Vehicles = () => {
  const { vehicles, deleteVehicle } = useDepot();
  const navigate = useNavigate();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Deletion Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Status Styles
  const statusStyles = {
    Available: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450 border border-emerald-200',
    'On Route': 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-450 border border-blue-150',
    Maintenance: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-450 border border-amber-200',
    'Out of Service': 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450 border border-rose-200'
  };

  // Unique types
  const vehicleTypes = ['All', ...new Set(vehicles.map(v => v.vehicleType))];

  // Filtering
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || v.vehicleType === filterType;
    return matchesSearch && matchesType;
  });

  const totalItems = filteredVehicles.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const openDeleteModal = (veh) => {
    setVehicleToDelete(veh);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (vehicleToDelete) {
      await deleteVehicle(vehicleToDelete.id);
      setVehicleToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Vehicle Management</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Manage fleet inventory, odometer readings, and service timelines.</p>
        </div>
        <button
          onClick={() => navigate('/vehicles/add')}
          className="flex items-center space-x-1.5 btn-primary text-xs font-bold shadow-md shadow-brand-500/10 py-2.5"
        >
          <IoAddOutline className="text-lg" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Query Filters */}
      <div className="bg-white dark:bg-darkbg-800 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4">
        <SearchBar 
          value={searchTerm} 
          onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} 
          placeholder="Search reg number (e.g. WP NB)..." 
        />
        
        <FilterDropdown 
          value={filterType} 
          onChange={(val) => { setFilterType(val); setCurrentPage(1); }} 
          options={vehicleTypes.map(t => ({ label: t === 'All' ? 'All Types' : t, value: t }))} 
          label="Filter Type"
        />
      </div>

      {/* Vehicles Table */}
      <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-fade">
        {totalItems > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-darkbg-900/50 text-slate-400 dark:text-slate-500 font-bold uppercase">
                  <th className="p-4">Reg Number</th>
                  <th className="p-4">Vehicle Type</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Mileage</th>
                  <th className="p-4">Fuel Type</th>
                  <th className="p-4">Next Service Due</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-350">
                {currentVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-darkbg-900/30 transition">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-200">{v.registrationNumber}</td>
                    <td className="p-4 font-semibold text-slate-550 dark:text-slate-400">{v.vehicleType}</td>
                    <td className="p-4 font-medium">{v.seatingCapacity} seats</td>
                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                      {new Intl.NumberFormat().format(v.mileage)} km
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-450">{v.fuelType}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-450">{v.nextServiceDate || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${statusStyles[v.vehicleStatus] || ''}`}>
                        {v.vehicleStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right flex space-x-1 justify-end">
                      <button
                        onClick={() => navigate(`/vehicles/${v.id}`)}
                        className="p-1.5 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-brand-600 rounded transition"
                        title="View Details / Maintain"
                      >
                        <IoEyeOutline className="text-lg" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(v)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 rounded transition"
                        title="Delete Vehicle"
                      >
                        <IoTrashOutline className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
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
            title="No Vehicles Registered" 
            message="No depot buses match your filter settings. Add a new bus registration." 
            icon={IoBusOutline} 
          />
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        title="Remove Vehicle" 
        message={`Are you sure you want to delete bus "${vehicleToDelete?.registrationNumber}"? This will clear all fuel consumption and maintenance histories associated with it.`} 
      />

    </div>
  );
};

export default Vehicles;
