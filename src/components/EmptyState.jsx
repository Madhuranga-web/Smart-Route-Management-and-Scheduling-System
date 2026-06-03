import React from 'react';
import { IoFolderOpenOutline } from 'react-icons/io5';

export const EmptyState = ({ title = "No data found", message = "Try adjusting your search filters or add a new entry.", icon: Icon = IoFolderOpenOutline }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-darkbg-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center animate-fade">
      <Icon className="text-5xl text-slate-300 dark:text-slate-600 mb-4" />
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mt-1 leading-relaxed">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
