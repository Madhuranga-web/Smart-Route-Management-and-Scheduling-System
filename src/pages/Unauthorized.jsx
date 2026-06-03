import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoShieldOutline } from 'react-icons/io5';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg-950 flex items-center justify-center p-6 transition-colors">
      <div className="bg-white dark:bg-darkbg-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-xl p-8 text-center space-y-6 animate-fade">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-500 mb-4 animate-bounce">
            <IoShieldOutline className="text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">
            Access Denied
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-sm">
            Your current account credentials are not authorized to view this administrative page. If you require access, please contact the Depot Administrator.
          </p>
        </div>

        <div className="flex space-x-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-750 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
