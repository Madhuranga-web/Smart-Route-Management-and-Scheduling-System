import { jsPDF } from 'jspdf';

export const generatePDFReport = (reportType, data) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const today = new Date().toLocaleString();

  // Header Banner Styling
  doc.setFillColor(30, 41, 59); // dark navy/slate
  doc.rect(0, 0, 210, 32, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Smart Route Management & Scheduling System', 12, 12);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Sri Lanka Central Depot Control Room Audit Log', 12, 18);
  doc.text(`Generated: ${today}`, 12, 24);

  // Decorative blue line
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 32, 210, 2, 'F');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);

  let startY = 45;

  if (reportType === 'routes') {
    doc.text('ROUTE PERFORMANCE & ASSIGNMENTS REPORT', 12, startY);
    startY += 10;

    // Table Headers
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Code', 12, startY);
    doc.text('Route Name', 30, startY);
    doc.text('Distance', 110, startY);
    doc.text('Driver', 130, startY);
    doc.text('Bus Plate', 175, startY);

    // Header Line
    doc.setDrawColor(200, 200, 200);
    doc.line(12, startY + 2, 198, startY + 2);
    startY += 8;

    doc.setFont('helvetica', 'normal');
    data.routes.forEach((r) => {
      if (startY > 280) { doc.addPage(); startY = 20; }
      doc.text(String(r.routeNumber), 12, startY);
      doc.text(String(r.routeName), 30, startY);
      doc.text(`${r.totalDistance} km`, 110, startY);
      doc.text(String(r.assignedDriver || 'Unassigned'), 130, startY);
      doc.text(String(r.assignedVehicle || 'Unassigned'), 175, startY);

      doc.line(12, startY + 2, 198, startY + 2);
      startY += 8;
    });

  } else if (reportType === 'fuel') {
    doc.text('FLEET FUEL CONSUMPTION & EXPENDITURE REPORT', 12, startY);
    startY += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Refill Date', 12, startY);
    doc.text('Bus Plate', 40, startY);
    doc.text('Odometer (km)', 80, startY);
    doc.text('Volume (L)', 120, startY);
    doc.text('Total Cost (LKR)', 160, startY);

    doc.line(12, startY + 2, 198, startY + 2);
    startY += 8;

    doc.setFont('helvetica', 'normal');
    data.fuelLogs.forEach((log) => {
      if (startY > 280) { doc.addPage(); startY = 20; }
      
      const v = data.vehicles.find(veh => veh.id === log.vehicleId);
      const reg = v ? v.registrationNumber : 'Deleted';

      doc.text(String(log.date), 12, startY);
      doc.text(String(reg), 40, startY);
      doc.text(`${new Intl.NumberFormat().format(log.mileage)} km`, 80, startY);
      doc.text(`${log.fuelAmount} L`, 120, startY);
      doc.text(`LKR ${new Intl.NumberFormat().format(log.cost)}`, 160, startY);

      doc.line(12, startY + 2, 198, startY + 2);
      startY += 8;
    });

  } else if (reportType === 'utilization') {
    doc.text('FLEET VEHICLE UTILIZATION & MAINTENANCE REPORT', 12, startY);
    startY += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Plate Number', 12, startY);
    doc.text('Type', 45, startY);
    doc.text('Capacity', 85, startY);
    doc.text('Mileage (km)', 115, startY);
    doc.text('Service Due', 150, startY);
    doc.text('Status', 180, startY);

    doc.line(12, startY + 2, 198, startY + 2);
    startY += 8;

    doc.setFont('helvetica', 'normal');
    data.vehicles.forEach((v) => {
      if (startY > 280) { doc.addPage(); startY = 20; }
      doc.text(String(v.registrationNumber), 12, startY);
      doc.text(String(v.vehicleType), 45, startY);
      doc.text(`${v.seatingCapacity} seats`, 85, startY);
      doc.text(`${new Intl.NumberFormat().format(v.mileage)} km`, 115, startY);
      doc.text(String(v.nextServiceDate || '-'), 150, startY);
      doc.text(String(v.vehicleStatus), 180, startY);

      doc.line(12, startY + 2, 198, startY + 2);
      startY += 8;
    });

  } else if (reportType === 'weekly') {
    doc.text('WEEKLY SCHEDULE OPERATIONS REPORT', 12, startY);
    startY += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 12, startY);
    doc.text('Departure', 35, startY);
    doc.text('Route Code', 60, startY);
    doc.text('Bus Plate', 90, startY);
    doc.text('Driver Operator', 130, startY);
    doc.text('Trip Status', 175, startY);

    doc.line(12, startY + 2, 198, startY + 2);
    startY += 8;

    doc.setFont('helvetica', 'normal');
    data.schedules.forEach((s) => {
      if (startY > 280) { doc.addPage(); startY = 20; }
      
      const r = data.routes.find(route => route.id === s.routeId);
      const v = data.vehicles.find(veh => veh.id === s.vehicleId);
      const d = data.drivers.find(drv => drv.id === s.driverId);

      doc.text(String(s.date), 12, startY);
      doc.text(String(s.departureTime), 35, startY);
      doc.text(String(r ? r.routeNumber : 'Unknown'), 60, startY);
      doc.text(String(v ? v.registrationNumber : 'Unknown'), 90, startY);
      doc.text(String(d ? d.fullName : 'Unknown'), 130, startY);
      doc.text(String(s.tripStatus), 175, startY);

      doc.line(12, startY + 2, 198, startY + 2);
      startY += 8;
    });
  }

  // Footer Branding page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages} | SRMSS Control Room System`, 12, 290);
    doc.text('Confidential - Internal Transport Depot Document Only', 130, 290);
  }

  // Save report
  doc.save(`srmss_${reportType}_report_${Date.now()}.pdf`);
};
