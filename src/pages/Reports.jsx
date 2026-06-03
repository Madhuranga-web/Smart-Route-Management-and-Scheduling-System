import React, { useState } from 'react';
import { useDepot } from '../context/DepotContext';
import { generatePDFReport } from '../utils/pdfGenerator';
import { IoDocumentTextOutline, IoDownloadOutline, IoFileTrayFullOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

export const Reports = () => {
  const { routes, drivers, vehicles, schedules, fuelLogs } = useDepot();

  const [downloading, setDownloading] = useState(null);

  const reportOptions = [
    {
      id: 'routes',
      title: 'Route Performance Report',
      description: 'Generates an audit of all active bus routes, intermediary stop nodes, and driver/vehicle assignments.',
      type: 'PDF'
    },
    {
      id: 'fuel',
      title: 'Fuel Consumption Report',
      description: 'Generates a report of fuel refills, costs in LKR, and average consumption rates per bus.',
      type: 'PDF'
    },
    {
      id: 'utilization',
      title: 'Vehicle Utilization Report',
      description: 'Provides a breakdown of fleet inventory, seating capacities, vehicle service history, and duty status.',
      type: 'PDF'
    },
    {
      id: 'weekly',
      title: 'Weekly Schedule Operations',
      description: 'Summarizes all completed, active, and delayed trip schedules on record.',
      type: 'PDF'
    }
  ];

  const handleDownload = (reportId) => {
    setDownloading(reportId);
    toast.loading(`Compiling ${reportId} datasets...`, { id: 'pdf_gen' });
    
    setTimeout(() => {
      try {
        const dataPayload = { routes, drivers, vehicles, schedules, fuelLogs };
        generatePDFReport(reportId, dataPayload);
        toast.success("Report downloaded successfully!", { id: 'pdf_gen' });
      } catch (e) {
        console.error(e);
        toast.error("Failed to generate PDF.", { id: 'pdf_gen' });
      } finally {
        setDownloading(null);
      }
    }, 1000);
  };

  // CSV export helper
  const handleCSVBackup = () => {
    toast.success("Mock backup completed! CSV logs downloaded.");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">Reporting Module</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Generate and download official PDF audits and logistics documentation for the transport depot.</p>
        </div>
        
        {/* CSV Backup action */}
        <button
          onClick={handleCSVBackup}
          className="flex items-center space-x-1.5 btn-secondary text-xs font-bold shadow-sm"
        >
          <IoFileTrayFullOutline className="text-base" />
          <span>Export All CSV Logs</span>
        </button>
      </div>

      {/* Grid of options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade">
        {reportOptions.map((opt) => (
          <div key={opt.id} className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-md hover:border-brand-200 dark:hover:border-brand-850 transition duration-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-brand-600 dark:text-brand-400">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl">
                  <IoDocumentTextOutline className="text-2xl" />
                </div>
                <h3 className="font-bold text-slate-850 dark:text-slate-150 text-base">{opt.title}</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {opt.description}
              </p>
            </div>

            <div className="border-t border-slate-50 dark:border-slate-700/60 pt-4 mt-6 flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 dark:bg-darkbg-900 px-2 py-0.5 rounded">
                Format: {opt.type} (A4 Document)
              </span>
              
              <button
                onClick={() => handleDownload(opt.id)}
                disabled={downloading !== null}
                className="flex items-center space-x-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/20 dark:hover:bg-brand-950/40 dark:text-brand-400 font-bold px-4 py-2 rounded-lg text-xs transition"
              >
                <IoDownloadOutline className="text-base" />
                <span>{downloading === opt.id ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Reports;
