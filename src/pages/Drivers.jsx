import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { IoAddOutline, IoPeopleOutline, IoEyeOutline, IoCreateOutline, IoTrashOutline, IoWarning } from 'react-icons/io5';

export const Drivers = () => {
  const { drivers, deleteDriver } = useDepot();
  const navigate = useNavigate();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Deletion Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  // Status Styles
  const statusStyles = {
    Available: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450 border border-emerald-250',
    'On Trip': 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-450 border border-blue-200',
    'On Leave': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-450 border border-amber-250',
    Suspended: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450 border border-rose-250'
  };

  const today = new Date();

  // Filter logic
  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = 
      d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nicNumber.includes(searchTerm) ||
      d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || d.driverStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredDrivers.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const openDeleteModal = (drv) => {
    setDriverToDelete(drv);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (driverToDelete) {
      await deleteDriver(driverToDelete.id);
      setDriverToDelete(null);
    }
  };

  // Helper check for license expiry (within 30 days)
  const isLicenseExpiringSoon = (expiryStr) => {
    if (!expiryStr) return false;
    const expiry = new Date(expiryStr);
    const diff = expiry - today;
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  const isLicenseExpired = (expiryStr) => {
    if (!expiryStr) return false;
    const expiry = new Date(expiryStr);
    return expiry < today;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Driver Management</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Register bus operators, track licensing credentials and availability records.</p>
        </div>
        <button
          onClick={() => navigate('/drivers/add')}
          className="flex items-center space-x-1.5 btn-primary text-xs font-bold shadow-md shadow-brand-500/10 py-2.5"
        >
          <IoAddOutline className="text-lg" />
          <span>Add New Driver</span>
        </button>
      </div>

      {/* Query Filters */}
      <div className="bg-white dark:bg-darkbg-800 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4">
        <SearchBar 
          value={searchTerm} 
          onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} 
          placeholder="Search name, NIC or license..." 
        />
        
        <FilterDropdown 
          value={filterStatus} 
          onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }} 
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Available', value: 'Available' },
            { label: 'On Trip', value: 'On Trip' },
            { label: 'On Leave', value: 'On Leave' },
            { label: 'Suspended', value: 'Suspended' }
          ]} 
          label="Filter Status"
        />
      </div>

      {/* Drivers List */}
      <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-fade">
        {totalItems > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-darkbg-900/50 text-slate-400 dark:text-slate-500 font-bold uppercase">
                  <th className="p-4">Name</th>
                  <th className="p-4">NIC Number</th>
                  <th className="p-4">License Code</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-350">
                {currentDrivers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-darkbg-900/30 transition">
                    <td className="p-4 font-semibold">{d.fullName}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{d.nicNumber}</td>
                    <td className="p-4 font-mono font-medium">{d.licenseNumber}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1.5">
                        <span className={isLicenseExpired(d.licenseExpiryDate) ? 'text-red-500 font-bold' : isLicenseExpiringSoon(d.licenseExpiryDate) ? 'text-amber-500 font-bold' : ''}>
                          {d.licenseExpiryDate}
                        </span>
                        {isLicenseExpired(d.licenseExpiryDate) && (
                          <IoWarning className="text-red-500" title="License Expired!" />
                        )}
                        {isLicenseExpiringSoon(d.licenseExpiryDate) && (
                          <IoWarning className="text-amber-500" title="License Expiring Soon!" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-500 dark:text-slate-400">{d.phoneNumber}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${statusStyles[d.driverStatus] || ''}`}>
                        {d.driverStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right flex space-x-1 justify-end">
                      <button
                        onClick={() => navigate(`/drivers/${d.id}`)}
                        className="p-1.5 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-brand-600 rounded transition"
                        title="View Profile / Edit"
                      >
                        <IoEyeOutline className="text-lg" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(d)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 rounded transition"
                        title="Delete Driver"
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
            title="No Drivers Found" 
            message="No depot driver operators match the specified parameters. Modify filters." 
            icon={IoPeopleOutline} 
          />
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        title="Delete Driver" 
        message={`Are you sure you want to delete "${driverToDelete?.fullName}"? This will erase their licensing details and profile from SRMSS database.`} 
      />

    </div>
  );
};

export default Drivers;
