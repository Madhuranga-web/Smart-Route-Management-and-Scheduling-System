import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDepot } from '../context/DepotContext';
import { IoSettingsOutline, IoPersonOutline, IoMoonOutline, IoSunnyOutline, IoShieldCheckmarkOutline, IoHelpCircleOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { currentUser, forgotPassword } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { auditLogs } = useDepot();

  const [activeTab, setActiveTab] = useState('account');
  const [prefNotification, setPrefNotification] = useState(true);

  const handlePasswordReset = async () => {
    try {
      await forgotPassword(currentUser.email);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreferencesSave = (e) => {
    e.preventDefault();
    toast.success("Preferences updated successfully!");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Control Room Settings</h1>
        <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Manage administrative preferences, visual mode themes, audit logs, and account recovery.</p>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        
        {/* Left Side: Navigation Links */}
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'account'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-darkbg-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-darkbg-900 border border-slate-100 dark:border-slate-800'
            }`}
          >
            <IoPersonOutline className="text-base" />
            <span>Account Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'appearance'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-darkbg-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-darkbg-900 border border-slate-100 dark:border-slate-800'
            }`}
          >
            <IoSettingsOutline className="text-base" />
            <span>Theme & Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'security'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-darkbg-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-darkbg-900 border border-slate-100 dark:border-slate-800'
            }`}
          >
            <IoShieldCheckmarkOutline className="text-base" />
            <span>Security Audits</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'help'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-darkbg-800 text-slate-650 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-darkbg-900 border border-slate-100 dark:border-slate-800'
            }`}
          >
            <IoHelpCircleOutline className="text-base" />
            <span>Depot Help Center</span>
          </button>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="flex-1 bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm min-h-[400px]">
          
          {/* Account Profile Tab */}
          {activeTab === 'account' && currentUser && (
            <div className="space-y-6 animate-fade">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-3">
                Authorized Account profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <p className="text-slate-400 font-bold uppercase mb-1">Account Display Name</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{currentUser.fullName}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase mb-1">Registered Control Email</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase mb-1">Depot Security Role</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm capitalize">{currentUser.role}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase mb-1">Depot Unique ID</p>
                  <p className="font-mono text-slate-500 dark:text-slate-400">{currentUser.uid}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-750 pt-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-750 dark:text-slate-300 uppercase">Change Account Password</h4>
                <p className="text-[11px] text-slate-500">
                  Click the button below and we will dispatch a secure email link to reset your account password.
                </p>
                <button
                  onClick={handlePasswordReset}
                  className="btn-secondary text-xs font-bold"
                >
                  Send Reset Instruction Email
                </button>
              </div>
            </div>
          )}

          {/* Theme & Preferences Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-fade">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-3">
                Preferences & Appearance Settings
              </h3>

              <form onSubmit={handlePreferencesSave} className="space-y-6">
                
                {/* Dark mode trigger */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-darkbg-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Dark Visual Mode</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Toggle theme layout coloring manually.</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="p-2.5 bg-white dark:bg-darkbg-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-350 hover:bg-slate-100 transition"
                  >
                    {darkMode ? <IoSunnyOutline className="text-lg text-amber-500" /> : <IoMoonOutline className="text-lg text-slate-650" />}
                  </button>
                </div>

                {/* Notifications settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-750 dark:text-slate-300 uppercase">Operational Notification preferences</h4>
                  
                  <label className="flex items-center space-x-3 text-xs text-slate-650 dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefNotification}
                      onChange={(e) => setPrefNotification(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-750 text-brand-600 focus:ring-brand-500 h-4 w-4"
                    />
                    <span>Receive service reminder notices for vehicles due within 7 days.</span>
                  </label>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="submit"
                    className="btn-primary text-xs font-bold"
                  >
                    Save Preferences
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Security Audits Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-3">
                Control Room Security Audits
              </h3>
              
              <div className="space-y-3.5 max-h-80 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 dark:bg-darkbg-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-750 dark:text-slate-300">
                      <span>{log.action}</span>
                      <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">{log.details}</p>
                    <p className="text-[9px] font-bold text-slate-400">Triggered by: {log.userEmail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help Center Tab */}
          {activeTab === 'help' && (
            <div className="space-y-6 animate-fade text-xs">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-3">
                Depot Help & Documentation Center
              </h3>

              <div className="space-y-4 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">How do I resolve schedule conflicts?</h4>
                  <p className="text-slate-500 mt-1">
                    The scheduling engine scans date and time parameters dynamically. A conflict warning triggers if the selected driver or vehicle is booked during an overlapping time window. Make sure to schedule non-overlapping time ranges for the same driver or vehicle on a given date.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">How do I generate official depot reports?</h4>
                  <p className="text-slate-500 mt-1">
                    Navigate to the "Reports" panel in the sidebar, choose a report category (Route performance, Fuel usage, Fleet utilization), and click "Download PDF". A custom PDF report will compile and save locally.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">System Developer Contact</h4>
                  <p className="text-slate-500 mt-1">
                    University Final Coursework Support Helpdesk: <span className="font-semibold text-brand-600 dark:text-brand-400">support@srmss.lk</span>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Settings;
