import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  IoGridOutline, 
  IoMapOutline, 
  IoCalendarOutline, 
  IoPeopleOutline, 
  IoBusOutline, 
  IoWaterOutline, 
  IoBuildOutline, 
  IoDocumentTextOutline, 
  IoSettingsOutline, 
  IoLogOutOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: IoGridOutline, roles: ['Admin', 'Supervisor', 'Staff'] },
    { name: 'Routes', path: '/routes', icon: IoMapOutline, roles: ['Admin', 'Supervisor'] },
    { name: 'Schedules', path: '/schedules', icon: IoCalendarOutline, roles: ['Admin', 'Supervisor', 'Staff'] },
    { name: 'Drivers', path: '/drivers', icon: IoPeopleOutline, roles: ['Admin', 'Supervisor'] },
    { name: 'Vehicles', path: '/vehicles', icon: IoBusOutline, roles: ['Admin', 'Supervisor'] },
    { name: 'Fuel Logs', path: '/fuel', icon: IoWaterOutline, roles: ['Admin', 'Supervisor'] },
    { name: 'Maintenance', path: '/maintenance', icon: IoBuildOutline, roles: ['Admin', 'Supervisor'] },
    { name: 'Reports', path: '/reports', icon: IoDocumentTextOutline, roles: ['Admin', 'Supervisor', 'Staff'] },
    { name: 'Settings', path: '/settings', icon: IoSettingsOutline, roles: ['Admin'] }
  ];

  // Filter items by user role
  const allowedMenuItems = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  const sidebarWidthClass = isCollapsed ? 'w-20' : 'w-64';

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <NavLink
        to={item.path}
        onClick={() => setIsMobileOpen(false)}
        className={({ isActive }) => `
          flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 group
          ${isActive 
            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkbg-900 hover:text-slate-900 dark:hover:text-white'}
        `}
      >
        <Icon className={`text-xl flex-shrink-0 transition-transform group-hover:scale-105`} />
        <span className={`transition-opacity duration-200 ${isCollapsed ? 'md:hidden opacity-0' : 'opacity-100'}`}>
          {item.name}
        </span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-darkbg-800 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all duration-300
        ${sidebarWidthClass}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header Branding */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                S
              </div>
              <span className={`font-bold text-slate-850 dark:text-slate-100 text-base tracking-tight transition-opacity duration-200 ${isCollapsed ? 'md:hidden' : ''}`}>
                SRMSS Depot
              </span>
            </div>
            {/* Collapse toggle button for Desktop */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex h-6 w-6 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-darkbg-800 items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 absolute -right-3 top-5 shadow-sm"
            >
              {isCollapsed ? <IoChevronForwardOutline className="text-xs" /> : <IoChevronBackOutline className="text-xs" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {allowedMenuItems.map((item, idx) => (
              <NavItem key={idx} item={item} />
            ))}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Dark Mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkbg-900 transition"
          >
            {darkMode ? (
              <>
                <IoSunnyOutline className="text-xl text-amber-500 flex-shrink-0" />
                <span className={isCollapsed ? 'md:hidden' : ''}>Light Mode</span>
              </>
            ) : (
              <>
                <IoMoonOutline className="text-xl text-slate-500 flex-shrink-0" />
                <span className={isCollapsed ? 'md:hidden' : ''}>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
