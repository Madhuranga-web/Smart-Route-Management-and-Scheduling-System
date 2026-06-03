export const INITIAL_ROUTES = [
  {
    id: "r1",
    routeName: "Colombo - Kandy Express",
    routeNumber: "EX-001",
    startLocation: "Colombo Fort",
    endLocation: "Kandy Goods Shed",
    intermediaryStops: ["Kadawatha", "Kegalle", "Peradeniya"],
    totalDistance: 115, // km
    estimatedDuration: "3h 15m",
    assignedDriver: "Dinesh Gunawardena",
    assignedVehicle: "WP NB-9988"
  },
  {
    id: "r2",
    routeName: "Colombo - Galle Southern Highway",
    routeNumber: "EX-002",
    startLocation: "Makumbura Multimodal Center",
    endLocation: "Galle Bus Stand",
    intermediaryStops: ["Gelanigama", "Dodangoda", "Imaduwa"],
    totalDistance: 120, // km
    estimatedDuration: "1h 45m",
    assignedDriver: "Pradeep Perera",
    assignedVehicle: "WP ND-5566"
  },
  {
    id: "r3",
    routeName: "Kurunegala - Colombo",
    routeNumber: "05-ORD",
    startLocation: "Kurunegala Bus Stand",
    endLocation: "Colombo Fort",
    intermediaryStops: ["Polgahawela", "Alawwa", "Warakapola", "Nittambuwa", "Kadawatha"],
    totalDistance: 94,
    estimatedDuration: "2h 45m",
    assignedDriver: "Sunil Shantha",
    assignedVehicle: "WP NC-1234"
  },
  {
    id: "r4",
    routeName: "Jaffna - Colombo Intercity",
    routeNumber: "EX-009",
    startLocation: "Jaffna Central Bus Stand",
    endLocation: "Colombo Fort",
    intermediaryStops: ["Kilinochchi", "Vavuniya", "Anuradhapura", "Kurunegala"],
    totalDistance: 395,
    estimatedDuration: "7h 30m",
    assignedDriver: "M. Thangarajah",
    assignedVehicle: "WP ND-8877"
  },
  {
    id: "r5",
    routeName: "Matara - Kandy Highway",
    routeNumber: "EX-015",
    startLocation: "Matara Bus Stand",
    endLocation: "Kandy Goods Shed",
    intermediaryStops: ["Galle", "Makumbura", "Kadawatha", "Kegalle"],
    totalDistance: 245,
    estimatedDuration: "4h 30m",
    assignedDriver: "Ruwan Kumara",
    assignedVehicle: "WP NE-3344"
  }
];

export const INITIAL_DRIVERS = [
  {
    id: "d1",
    fullName: "Dinesh Gunawardena",
    nicNumber: "198512345678",
    licenseNumber: "B1234567",
    licenseExpiryDate: "2028-10-15",
    phoneNumber: "0771234567",
    email: "dinesh.g@srmss.lk",
    assignedRoutes: ["Colombo - Kandy Express"],
    workingHours: "06:00 - 14:00",
    driverStatus: "Available" // Available, On Trip, On Leave, Suspended
  },
  {
    id: "d2",
    fullName: "Pradeep Perera",
    nicNumber: "198845678901",
    licenseNumber: "B7654321",
    licenseExpiryDate: "2027-04-20",
    phoneNumber: "0719876543",
    email: "pradeep.p@srmss.lk",
    assignedRoutes: ["Colombo - Galle Southern Highway"],
    workingHours: "08:00 - 16:00",
    driverStatus: "Available"
  },
  {
    id: "d3",
    fullName: "Sunil Shantha",
    nicNumber: "197609876543",
    licenseNumber: "B9988776",
    licenseExpiryDate: "2026-06-30", // Expiry soon
    phoneNumber: "0751112223",
    email: "sunil.s@srmss.lk",
    assignedRoutes: ["Kurunegala - Colombo"],
    workingHours: "05:00 - 13:00",
    driverStatus: "On Trip"
  },
  {
    id: "d4",
    fullName: "M. Thangarajah",
    nicNumber: "199023456789",
    licenseNumber: "B3344556",
    licenseExpiryDate: "2029-12-05",
    phoneNumber: "0725556667",
    email: "thangarajah.m@srmss.lk",
    assignedRoutes: ["Jaffna - Colombo Intercity"],
    workingHours: "20:00 - 04:00",
    driverStatus: "On Leave"
  },
  {
    id: "d5",
    fullName: "Ruwan Kumara",
    nicNumber: "198277665544",
    licenseNumber: "B4455667",
    licenseExpiryDate: "2027-08-11",
    phoneNumber: "0788889999",
    email: "ruwan.k@srmss.lk",
    assignedRoutes: ["Matara - Kandy Highway"],
    workingHours: "07:00 - 15:00",
    driverStatus: "Available"
  },
  {
    id: "d6",
    fullName: "Amara Siriwardena",
    nicNumber: "199200112233",
    licenseNumber: "B7788990",
    licenseExpiryDate: "2030-01-20",
    phoneNumber: "0777778888",
    email: "amara.s@srmss.lk",
    assignedRoutes: [],
    workingHours: "09:00 - 17:00",
    driverStatus: "Available"
  }
];

export const INITIAL_VEHICLES = [
  {
    id: "v1",
    registrationNumber: "WP NB-9988",
    vehicleType: "AC Coach", // Leyland Bus, AC Coach, SLTB Bus
    seatingCapacity: 45,
    mileage: 185200, // km
    fuelType: "Diesel",
    vehicleStatus: "Available", // Available, On Route, Maintenance, Out of Service
    lastServiceDate: "2026-05-10",
    nextServiceDate: "2026-08-10"
  },
  {
    id: "v2",
    registrationNumber: "WP ND-5566",
    vehicleType: "AC Coach",
    seatingCapacity: 40,
    mileage: 95400,
    fuelType: "Diesel",
    vehicleStatus: "Available",
    lastServiceDate: "2026-04-18",
    nextServiceDate: "2026-07-18"
  },
  {
    id: "v3",
    registrationNumber: "WP NC-1234",
    vehicleType: "Leyland Bus",
    seatingCapacity: 54,
    mileage: 320600,
    fuelType: "Diesel",
    vehicleStatus: "On Route",
    lastServiceDate: "2026-05-02",
    nextServiceDate: "2026-08-02"
  },
  {
    id: "v4",
    registrationNumber: "WP ND-8877",
    vehicleType: "AC Luxury Cruiser",
    seatingCapacity: 36,
    mileage: 124300,
    fuelType: "Diesel",
    vehicleStatus: "Maintenance",
    lastServiceDate: "2026-05-20",
    nextServiceDate: "2026-06-20"
  },
  {
    id: "v5",
    registrationNumber: "WP NE-3344",
    vehicleType: "SLTB Bus",
    seatingCapacity: 54,
    mileage: 241900,
    fuelType: "Diesel",
    vehicleStatus: "Available",
    lastServiceDate: "2026-03-29",
    nextServiceDate: "2026-06-29"
  }
];

export const INITIAL_SCHEDULES = [
  {
    id: "s1",
    routeId: "r1",
    driverId: "d1",
    vehicleId: "v1",
    date: "2026-05-28",
    departureTime: "07:00",
    arrivalTime: "10:15",
    tripStatus: "Completed", // Scheduled, Active, Delayed, Completed, Cancelled
    notes: "Express highway run, no delays reported."
  },
  {
    id: "s2",
    routeId: "r2",
    driverId: "d2",
    vehicleId: "v2",
    date: "2026-05-28",
    departureTime: "08:30",
    arrivalTime: "10:15",
    tripStatus: "Active",
    notes: "Southern highway route, operating normally."
  },
  {
    id: "s3",
    routeId: "r3",
    driverId: "d3",
    vehicleId: "v3",
    date: "2026-05-28",
    departureTime: "11:00",
    arrivalTime: "13:45",
    tripStatus: "Delayed",
    notes: "Traffic jam near Nittambuwa, 25 minutes delay expected."
  },
  {
    id: "s4",
    routeId: "r4",
    driverId: "d4",
    vehicleId: "v4",
    date: "2026-05-28",
    departureTime: "20:00",
    arrivalTime: "03:30",
    tripStatus: "Scheduled",
    notes: "Overnight trip."
  },
  {
    id: "s5",
    routeId: "r5",
    driverId: "d5",
    vehicleId: "v5",
    date: "2026-05-29",
    departureTime: "06:30",
    arrivalTime: "11:00",
    tripStatus: "Scheduled",
    notes: "Scheduled weekly transport."
  }
];

export const INITIAL_FUEL_LOGS = [
  {
    id: "f1",
    vehicleId: "v1",
    fuelAmount: 75.5, // Litres
    cost: 25670.00, // LKR
    date: "2026-05-25",
    mileage: 184950
  },
  {
    id: "f2",
    vehicleId: "v2",
    fuelAmount: 62.0,
    cost: 21080.00,
    date: "2026-05-26",
    mileage: 95100
  },
  {
    id: "f3",
    vehicleId: "v3",
    fuelAmount: 110.0,
    cost: 37400.00,
    date: "2026-05-24",
    mileage: 320100
  },
  {
    id: "f4",
    vehicleId: "v4",
    fuelAmount: 85.0,
    cost: 28900.00,
    date: "2026-05-27",
    mileage: 124250
  },
  {
    id: "f5",
    vehicleId: "v5",
    fuelAmount: 90.0,
    cost: 30600.00,
    date: "2026-05-25",
    mileage: 241550
  }
];

export const INITIAL_MAINTENANCE_LOGS = [
  {
    id: "m1",
    vehicleId: "v4",
    serviceType: "Engine Overhaul & Oil Filter",
    serviceDate: "2026-05-20",
    cost: 75000.00,
    description: "Replaced oil filter, engine oil change, and general inspection.",
    nextServiceDate: "2026-06-20"
  },
  {
    id: "m2",
    vehicleId: "v1",
    serviceType: "Brake Pad Replacement",
    serviceDate: "2026-05-10",
    cost: 18500.00,
    description: "Replaced front and rear brake pads. Adjusted brake calipers.",
    nextServiceDate: "2026-08-10"
  },
  {
    id: "m3",
    vehicleId: "v3",
    serviceType: "Tyre Replacement",
    serviceDate: "2026-05-02",
    cost: 120000.00,
    description: "Fitted four new rear tyres and balanced wheels.",
    nextServiceDate: "2026-08-02"
  }
];

export const AUDIT_LOGS = [
  {
    id: "a1",
    userId: "admin1",
    userEmail: "admin@srmss.lk",
    action: "Add Schedule",
    details: "Created schedule s5 for Route r5 Matara-Kandy",
    timestamp: "2026-05-28T08:15:30Z"
  },
  {
    id: "a2",
    userId: "supervisor1",
    userEmail: "supervisor@srmss.lk",
    action: "Update Vehicle Status",
    details: "Changed vehicle v4 WP ND-8877 status to Maintenance",
    timestamp: "2026-05-28T09:30:12Z"
  },
  {
    id: "a3",
    userId: "admin1",
    userEmail: "admin@srmss.lk",
    action: "Add Driver",
    details: "Added driver d6 Amara Siriwardena",
    timestamp: "2026-05-28T10:45:00Z"
  }
];
