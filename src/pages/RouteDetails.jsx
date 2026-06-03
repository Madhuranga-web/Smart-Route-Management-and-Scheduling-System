import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDepot } from '../context/DepotContext';
import RouteMap from '../components/RouteMap';
import { IoChevronBackOutline, IoMapOutline, IoBusOutline, IoPersonOutline, IoTimeOutline, IoNavigateCircleOutline } from 'react-icons/io5';

export const RouteDetails = () => {
  const { id } = useParams();
  const { routes } = useDepot();
  const navigate = useNavigate();

  const route = routes.find(r => r.id === id);

  if (!route) {
    return (
      <div className="bg-white dark:bg-darkbg-800 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
        <h3 className="text-lg font-bold text-red-600">Route not found</h3>
        <button onClick={() => navigate('/routes')} className="btn-primary mt-4">
          Back to Routes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Back navigation */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/routes')}
          className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-darkbg-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <IoChevronBackOutline className="text-lg" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded uppercase tracking-wider">
            Route Info: {route.routeNumber}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-850 dark:text-slate-50 mt-1">{route.routeName}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Route Profile Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-darkbg-800 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-3">
              Route Parameters
            </h3>
            
            {/* Stat Row 1 */}
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                <IoNavigateCircleOutline className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Path Distance</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-250">{route.totalDistance} kilometers</p>
              </div>
            </div>

            {/* Stat Row 2 */}
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                <IoTimeOutline className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estimated Transit Duration</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-250">{route.estimatedDuration}</p>
              </div>
            </div>

            {/* Stat Row 3 */}
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                <IoPersonOutline className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Assigned Driver</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-250">
                  {route.assignedDriver || <span className="text-slate-400 font-normal italic">Unassigned</span>}
                </p>
              </div>
            </div>

            {/* Stat Row 4 */}
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                <IoBusOutline className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Assigned Fleet Vehicle</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-250">
                  {route.assignedVehicle || <span className="text-slate-400 font-normal italic">Unassigned</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Intermediary Stops Listing */}
          <div className="bg-white dark:bg-darkbg-800 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
              Stops & Station Nodes
            </h3>
            
            <div className="relative border-l-2 border-slate-200 dark:border-slate-750 pl-5 ml-2.5 space-y-6">
              
              {/* Start Stop node */}
              <div className="relative">
                <span className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-white dark:bg-darkbg-800 shadow-sm z-10"></span>
                <p className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider">Origin Terminus</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{route.startLocation}</p>
              </div>

              {/* Intermediary Stop nodes */}
              {route.intermediaryStops.map((stop, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border border-slate-400 bg-white dark:bg-darkbg-800 shadow-sm z-10"></span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Waypoint Node {i + 1}</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-350">{stop}</p>
                </div>
              ))}

              {/* End Stop node */}
              <div className="relative">
                <span className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-rose-500 bg-white dark:bg-darkbg-800 shadow-sm z-10"></span>
                <p className="text-[9px] font-extrabold text-rose-500 uppercase tracking-wider">Destination Terminus</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{route.endLocation}</p>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Interactive Leaflet Map */}
        <div className="lg:col-span-2 bg-white dark:bg-darkbg-800 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
            Route Map Path Visualization
          </h3>
          <div className="flex-1 min-h-[400px]">
            <RouteMap 
              startName={route.startLocation} 
              endName={route.endLocation} 
              stops={route.intermediaryStops} 
              activeRouteName={`${route.routeNumber}: ${route.routeName}`}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default RouteDetails;
