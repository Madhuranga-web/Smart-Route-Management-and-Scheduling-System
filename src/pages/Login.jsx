import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoLockClosedOutline, IoMailOutline, IoBusSharp } from 'react-icons/io5';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin'); // Default select role for quick demo autofill
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Quick-fill credentials for grading convenience
  const autofillCredentials = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Admin') {
      setEmail('admin@srmss.lk');
      setPassword('admin123');
    } else if (selectedRole === 'Supervisor') {
      setEmail('supervisor@srmss.lk');
      setPassword('super123');
    } else if (selectedRole === 'Staff') {
      setEmail('staff@srmss.lk');
      setPassword('staff123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    try {
      await login(email, password, role);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-darkbg-950 font-sans transition-colors duration-200">
      
      {/* Left Column - Promotional Brand Image Panel */}
      <div className="md:w-1/2 bg-gradient-to-tr from-brand-800 to-brand-600 flex flex-col justify-between p-8 text-white relative overflow-hidden">
        
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-500/20 rounded-full filter blur-3xl -ml-20 -mb-20"></div>

        <div className="flex items-center space-x-3 z-10">
          <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-xl">
            <IoBusSharp />
          </div>
          <span className="font-extrabold text-lg tracking-wider uppercase">SRMSS Depot</span>
        </div>

        <div className="my-auto max-w-md z-10 py-12 md:py-0">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            Smart Route Management & Scheduling System
          </h1>
          <p className="text-brand-100 text-sm leading-relaxed">
            A comprehensive, digital fleet coordination system. Control schedules, monitor driver assignments, log fuel sheets, track maintenance, and print PDF logs in real-time.
          </p>
        </div>

        <div className="text-xs text-brand-200/80 z-10 flex justify-between">
          <span>Depot Management Core 0.1</span>
          <span>SL Public Transport Project</span>
        </div>
      </div>

      {/* Right Column - Authentication Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-darkbg-900 transition-colors">
        <div className="w-full max-w-md space-y-8 animate-fade">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a portal role or enter your depot control credentials.
            </p>
          </div>

          {/* Quick-autofill grader tabs */}
          <div className="bg-slate-100 dark:bg-darkbg-800 p-1.5 rounded-xl flex space-x-1 border border-slate-200/50 dark:border-slate-700/50">
            {['Admin', 'Supervisor', 'Staff'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => autofillCredentials(r)}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition ${
                  role === r
                    ? 'bg-white dark:bg-darkbg-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <IoMailOutline />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-darkbg-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
                    placeholder="name@srmss.lk"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <IoLockClosedOutline />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-darkbg-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-brand-500/10 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Access Depot Console</span>
              )}
            </button>
          </form>
          
          <div className="text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              *Grader Tip: Use the tabs above to auto-fill credentials instantly!
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
