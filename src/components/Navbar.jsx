import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDepot } from '../context/DepotContext';
import { 
  IoMenuOutline, 
  IoNotificationsOutline, 
  IoPersonCircleOutline, 
  IoSearchOutline, 
  IoWarningOutline, 
  IoCheckmarkDoneCircleOutline 
} from 'react-icons/io5';

export const Navbar = ({ isCollapsed, setIsMobileOpen }) => {
  const { currentUser } = useAuth();
  const { vehicles, drivers } = useDepot();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Compute smart service and license alerts
  useEffect(() => {
    const alerts = [];
    const today = new Date();

    // 1. Check vehicles for service reminders (due within 7 days or overdue)
    vehicles.forEach(v => {
      if (v.nextServiceDate) {
        const serviceDate = new Date(v.nextServiceDate);
        const diffTime = serviceDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          alerts.push({
            id: `v_overdue_${v.id}`,
            type: 'alert',
            title: `Service Overdue: ${v.registrationNumber}`,
            message: `Next service was scheduled for ${v.nextServiceDate}.`,
            time: 'Immediate Action'
          });
        } else if (diffDays <= 7) {
          alerts.push({
            id: `v_due_${v.id}`,
            type: 'warning',
            title: `Service Due: ${v.registrationNumber}`,
            message: `Scheduled for service in ${diffDays} days (${v.nextServiceDate}).`,
            time: 'Soon'
          });
        }
      }
    });

    // 2. Check drivers for license expiry (due within 30 days or expired)
    drivers.forEach(d => {
      if (d.licenseExpiryDate) {
        const expiryDate = new Date(d.licenseExpiryDate);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          alerts.push({
            id: `d_expired_${d.id}`,
            type: 'alert',
            title: `License Expired: ${d.fullName}`,
            message: `Driving license expired on ${d.licenseExpiryDate}.`,
            time: 'Immediate Action'
          });
        } else if (diffDays <= 30) {
          alerts.push({
            id: `d_expiring_${d.id}`,
            type: 'warning',
            title: `License Expiry: ${d.fullName}`,
            message: `License expires in ${diffDays} days (${d.licenseExpiryDate}).`,
            time: 'Soon'
          });
        }
      }
    });

    // Add a default welcome notification if empty
    if (alerts.length === 0) {
      alerts.push({
        id: 'welcome',
        type: 'info',
        title: 'System Operational',
        message: 'Depot operations database synced. All schedules active.',
        time: 'Now'
      });
    }

    setNotifications(alerts);
  }, [vehicles, drivers]);

  return (
    <header className="h-16 bg-white dark:bg-darkbg-800 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
      
      {/* Mobile Burger & Sidebar toggle */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-lg md:hidden"
        >
          <IoMenuOutline className="text-2xl" />
        </button>
        
        {/* Page Title Context Indicator */}
        <span className="hidden sm:inline-block text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full uppercase tracking-wider">
          Sri Lanka Central Depot Control Room
        </span>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center space-x-4 relative">
        
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-lg relative transition"
          >
            <IoNotificationsOutline className="text-2xl" />
            {notifications.length > 0 && notifications[0].id !== 'welcome' && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 border border-white"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <>
              {/* Backdrop to close panel */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              
              <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-up">
                <div className="px-4 py-3 border-b border-slate-150 dark:border-slate-700 bg-slate-50 dark:bg-darkbg-900 flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-250 uppercase tracking-wide">
                    Operational Alerts ({notifications.length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                    Depot Log
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3.5 hover:bg-slate-50 dark:hover:bg-darkbg-900 flex space-x-3 transition">
                      <div className="flex-shrink-0 mt-0.5">
                        {n.type === 'alert' ? (
                          <IoWarningOutline className="text-lg text-rose-500" />
                        ) : n.type === 'warning' ? (
                          <IoWarningOutline className="text-lg text-amber-500" />
                        ) : (
                          <IoCheckmarkDoneCircleOutline className="text-lg text-emerald-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {n.message}
                        </p>
                        <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-1">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

        {/* User Card */}
        {currentUser && (
          <div className="flex items-center space-x-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-250 leading-tight">
                {currentUser.fullName}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {currentUser.role}
              </p>
            </div>
            <IoPersonCircleOutline className="text-3xl text-slate-400 dark:text-slate-500" />
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
