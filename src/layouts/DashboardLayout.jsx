import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mainMarginClass = isCollapsed ? 'md:ml-20' : 'md:ml-64';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg-900 transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Container */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${mainMarginClass}`}>
        
        {/* Top Navbar */}
        <Navbar 
          isCollapsed={isCollapsed} 
          setIsMobileOpen={setIsMobileOpen} 
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
        
        {/* Simple Footer */}
        <footer className="py-4 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400 dark:text-slate-500 bg-white dark:bg-darkbg-800 transition-colors">
          Smart Route Management and Scheduling System &copy; {new Date().getFullYear()} &bull; Final Year Coursework Project &bull; SL Depots
        </footer>

      </div>
    </div>
  );
};

export default DashboardLayout;
