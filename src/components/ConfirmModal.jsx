import React from 'react';
import { IoWarningOutline } from 'react-icons/io5';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade">
      <div className="bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        <div className="p-6">
          <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-500 mb-4">
            <IoWarningOutline className="text-3xl" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
            {message}
          </p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm transition"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition shadow-sm"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
