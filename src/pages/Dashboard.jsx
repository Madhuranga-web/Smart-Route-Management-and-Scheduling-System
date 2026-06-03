import React from 'react';
import { useDepot } from '../context/DepotContext';
import StatCard from '../components/StatCard';
import { 
  IoMapOutline, 
  IoBusOutline, 
  IoAlertCircleOutline, 
  IoPeopleOutline, 
  IoColorFillOutline,
  IoCheckmarkDoneCircleOutline
} from 'react-icons/io5';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

export const Dashboard = () => {
  const { routes, drivers, vehicles, schedules, fuelLogs, auditLogs } = useDepot();

  // --- KPI Stats Computations ---
  const totalRoutes = routes.length;
  const totalVehicles = vehicles.length;
  const activeBuses = schedules.filter(s => s.tripStatus === 'Active').length;
  const delayedTrips = schedules.filter(s => s.tripStatus === 'Delayed').length;
  const availableDrivers = drivers.filter(d => d.driverStatus === 'Available').length;
  
  // Fuel usage (cost sum)
  const totalFuelCost = fuelLogs.reduce((sum, log) => sum + Number(log.cost), 0);
  const formattedFuelCost = new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(totalFuelCost);

  // --- Charts Data Formatting ---

  // 1. Fuel Consumption Chart (per Vehicle)
  const fuelChartData = vehicles.map(v => {
    const vLogs = fuelLogs.filter(f => f.vehicleId === v.id);
    const amount = vLogs.reduce((sum, l) => sum + Number(l.fuelAmount), 0);
    return {
      regNo: v.registrationNumber.split(' ')[1] || v.registrationNumber,
      Litres: amount
    };
  }).filter(d => d.Litres > 0);

  // 2. Route Performance (Distance & Schedule Count)
  const routeChartData = routes.map(r => {
    const tripCount = schedules.filter(s => s.routeId === r.id).length;
    return {
      route: r.routeNumber,
      Distance: r.totalDistance,
      Trips: tripCount
    };
  });

  // 3. Vehicle Utilization Chart (Status Distribution)
  const statusSummary = vehicles.reduce((acc, v) => {
    acc[v.vehicleStatus] = (acc[v.vehicleStatus] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusSummary).map(status => ({
    name: status,
    value: statusSummary[status]
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  // 4. Weekly Trip Completions
  const tripCompletionData = [
    { day: 'Mon', Completed: 8, Target: 10 },
    { day: 'Tue', Completed: 12, Target: 10 },
    { day: 'Wed', Completed: 9, Target: 10 },
    { day: 'Thu', Completed: 14, Target: 12 },
    { day: 'Fri', Completed: 11, Target: 12 },
    { day: 'Sat', Completed: 16, Target: 15 },
    { day: 'Sun', Completed: 13, Target: 12 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-850 dark:text-slate-50">Depot Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time indicators and fleet operations summary.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="Total Routes" 
          value={totalRoutes} 
          icon={IoMapOutline} 
          color="blue" 
          trend="+1 Route added" 
          trendType="up" 
        />
        <StatCard 
          title="Fleet Size" 
          value={totalVehicles} 
          icon={IoBusOutline} 
          color="purple" 
          trend="All registered" 
          trendType="info" 
        />
        <StatCard 
          title="Active Buses" 
          value={activeBuses} 
          icon={IoCheckmarkDoneCircleOutline} 
          color="green" 
          trend="On route" 
          trendType="up" 
        />
        <StatCard 
          title="Delayed Trips" 
          value={delayedTrips} 
          icon={IoAlertCircleOutline} 
          color="red" 
          trend={delayedTrips > 0 ? "Requires attention" : "No delays"} 
          trendType={delayedTrips > 0 ? "down" : "up"} 
        />
        <StatCard 
          title="Avail. Drivers" 
          value={availableDrivers} 
          icon={IoPeopleOutline} 
          color="green" 
          trend="Active standby" 
          trendType="up" 
        />
        <StatCard 
          title="Total Fuel Cost" 
          value={formattedFuelCost} 
          icon={IoColorFillOutline} 
          color="orange" 
          trend="Logged refills" 
          trendType="info" 
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Trip Completion Chart */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wide">
            Weekly Trip Completions
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tripCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Line type="monotone" dataKey="Completed" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Route Distances and Scheduled Trips */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wide">
            Route Distances (km)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                <XAxis dataKey="route" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Bar dataKey="Distance" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {routeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#60a5fa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Consumption Logs */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wide">
            Fuel Refill Volume (Litres)
          </h3>
          <div className="h-72">
            {fuelChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fuelChartData}>
                  <defs>
                    <linearGradient id="colorLitres" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis dataKey="regNo" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="Litres" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLitres)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No fuel refill records logged yet.
              </div>
            )}
          </div>
        </div>

        {/* Fleet Status Pie Chart */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wide">
            Fleet Allocation Status
          </h3>
          <div className="h-72 flex flex-col sm:flex-row items-center justify-around">
            <div className="w-full sm:w-1/2 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Pie Legend */}
            <div className="space-y-2 mt-4 sm:mt-0">
              {pieData.map((entry, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <span className="h-3 w-3 rounded" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{entry.name}:</span>
                  <span className="text-slate-500 dark:text-slate-450">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Audit Logs Table Preview */}
      <div className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wide">
          Recent Depot Activity Audit Trail
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-bold uppercase">
                <th className="pb-3 pl-2">Timestamp</th>
                <th className="pb-3">User</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
              {auditLogs.slice(0, 5).map((log, index) => (
                <tr key={log.id || index} className="hover:bg-slate-50/50 dark:hover:bg-darkbg-900/30 transition">
                  <td className="py-3 pl-2 text-slate-400 font-medium">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 font-semibold">{log.userEmail}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
