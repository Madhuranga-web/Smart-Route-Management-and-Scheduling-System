import React from 'react';

export const FilterDropdown = ({ value, onChange, options, label }) => {
  return (
    <div className="flex items-center space-x-2 w-full md:w-auto">
      {label && <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">{label}:</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full md:w-auto px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-darkbg-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
