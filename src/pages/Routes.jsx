import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import { SearchBar } from '../components/SearchBar';
import { FilterDropdown } from '../components/FilterDropdown';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { ConfirmModal } from '../components/ConfirmModal';
import { IoAddOutline, IoEyeOutline, IoCreateOutline, IoTrashOutline, IoMapOutline } from 'react-icons/io5';

export const Routes = () => {
  const { routes, deleteRoute } = useDepot();
  const navigate = useNavigate();
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStart, setFilterStart] = useState('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Deletion Confirm Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);

  // Get unique start locations for filters
  const uniqueStartLocations = ['All', ...new Set(routes.map(r => r.startLocation))];

  // Filtering Logic
  const filteredRoutes = routes.filter((r) => {
    const matchesSearch = 
      r.routeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.routeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStart = filterStart === 'All' || r.startLocation === filterStart;
    
    return matchesSearch && matchesStart;
  });

  // Pagination Logic
  const totalItems = filteredRoutes.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoutes = filteredRoutes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openDeleteModal = (route) => {
    setRouteToDelete(route);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (routeToDelete) {
      await deleteRoute(routeToDelete.id);
      setRouteToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-850 dark:text-slate-50">Route Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage transit pathways, stops, distances and driver/bus assignments.</p>
        </div>
        <button
          onClick={() => navigate('/routes/add')}
          className="flex items-center space-x-1.5 btn-primary text-xs font-bold shadow-md shadow-brand-500/10 py-2.5"
        >
          <IoAddOutline className="text-lg" />
          <span>Add New Route</span>
        </button>
      </div>

      {/* Query Filters Bar */}
      <div className="bg-white dark:bg-darkbg-800 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4">
        <SearchBar 
          value={searchTerm} 
          onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} 
          placeholder="Search name or code..." 
        />
        
        <FilterDropdown 
          value={filterStart} 
          onChange={(val) => { setFilterStart(val); setCurrentPage(1); }} 
          options={uniqueStartLocations.map(loc => ({ label: loc === 'All' ? 'All Starts' : loc, value: loc }))} 
          label="Filter Start"
        />
      </div>

      {/* Routes List Table / Grid */}
      <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {totalItems > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-darkbg-900/50 text-slate-400 dark:text-slate-500 font-bold uppercase">
                  <th className="p-4">Route Code</th>
                  <th className="p-4">Route Name</th>
                  <th className="p-4">From</th>
                  <th className="p-4">To</th>
                  <th className="p-4">Distance</th>
                  <th className="p-4">Assigned Bus</th>
                  <th className="p-4">Assigned Driver</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-300">
                {currentRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-50/50 dark:hover:bg-darkbg-900/30 transition">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-200">
                      <span className="bg-brand-50 dark:bg-brand-950/40 text-brand-650 dark:text-brand-400 px-2 py-0.5 rounded font-bold text-[10px]">
                        {route.routeNumber}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{route.routeName}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{route.startLocation}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{route.endLocation}</td>
                    <td className="p-4 font-medium">{route.totalDistance} km</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {route.assignedVehicle || <span className="text-slate-350 italic">None</span>}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {route.assignedDriver || <span className="text-slate-350 italic">None</span>}
                    </td>
                    <td className="p-4 text-right flex space-x-1.5 justify-end">
                      <button
                        onClick={() => navigate(`/routes/${route.id}`)}
                        className="p-1.5 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-brand-600 rounded transition"
                        title="View details / map"
                      >
                        <IoEyeOutline className="text-lg" />
                      </button>
                      <button
                        onClick={() => navigate(`/routes/edit/${route.id}`)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded transition"
                        title="Edit Route"
                      >
                        <IoCreateOutline className="text-lg" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(route)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 rounded transition"
                        title="Delete Route"
                      >
                        <IoTrashOutline className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <Pagination 
              currentPage={currentPage} 
              totalItems={totalItems} 
              itemsPerPage={itemsPerPage} 
              onPageChange={handlePageChange} 
            />
          </div>
        ) : (
          <EmptyState 
            title="No Routes Found" 
            message="No transit routes match your search or filter values. Try clearing query fields." 
            icon={IoMapOutline} 
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        title="Delete Route" 
        message={`Are you sure you want to delete the route "${routeToDelete?.routeName}" (${routeToDelete?.routeNumber})? This action will permanently remove it from the depot control record.`} 
      />

    </div>
  );
};

export default Routes;
