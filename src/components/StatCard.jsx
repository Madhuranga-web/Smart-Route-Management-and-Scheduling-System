import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, trendType = 'up' }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/50'
    },
    green: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/50'
    },
    orange: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/50'
    },
    red: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/50'
    },
    purple: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-900/50'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {title}
          </span>
          <h3 className="text-2xl font-bold text-slate-850 dark:text-slate-50 mt-1">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center space-x-1.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            trendType === 'up' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
              : trendType === 'down'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                : 'bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400'
          }`}>
            {trend}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            vs last period
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
