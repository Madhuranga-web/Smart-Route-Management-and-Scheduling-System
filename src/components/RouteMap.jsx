import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icon bug in React bundlers
// We will use CSS/SVG based divIcons for a much sleeker, customized modern look.
const createCustomMarker = (color = '#2563eb', label = '') => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-6 w-6 animate-ping rounded-full opacity-75" style="background-color: ${color};"></span>
        <div class="relative flex items-center justify-center h-5 w-5 rounded-full border-2 border-white shadow-md text-[10px] font-bold text-white" style="background-color: ${color};">
          ${label}
        </div>
      </div>
    `,
    className: 'custom-leaflet-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const stopIcon = L.divIcon({
  html: `<div class="h-3.5 w-3.5 rounded-full bg-slate-650 border border-white shadow-sm"></div>`,
  className: 'custom-stop-marker',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Coordinates for Sri Lankan cities
export const CITY_COORDS = {
  "Colombo Fort": [6.9271, 79.8612],
  "Colombo": [6.9271, 79.8612],
  "Kadawatha": [7.0016, 79.9540],
  "Kegalle": [7.2513, 80.3424],
  "Peradeniya": [7.2711, 80.5960],
  "Kandy Goods Shed": [7.2906, 80.6337],
  "Kandy": [7.2906, 80.6337],
  "Makumbura Multimodal Center": [6.8406, 79.9983],
  "Makumbura": [6.8406, 79.9983],
  "Gelanigama": [6.7212, 80.0571],
  "Dodangoda": [6.5772, 80.0412],
  "Imaduwa": [6.1132, 80.3705],
  "Galle Bus Stand": [6.0535, 80.2210],
  "Galle": [6.0535, 80.2210],
  "Polgahawela": [7.3402, 80.2975],
  "Alawwa": [7.3005, 80.1382],
  "Warakapola": [7.2241, 80.1983],
  "Nittambuwa": [7.1420, 80.0963],
  "Kurunegala Bus Stand": [7.4863, 80.3647],
  "Kurunegala": [7.4863, 80.3647],
  "Kilinochchi": [9.3970, 80.4010],
  "Vavuniya": [8.7514, 80.4971],
  "Anuradhapura": [8.3122, 80.4131],
  "Jaffna Central Bus Stand": [9.6615, 80.0255],
  "Jaffna": [9.6615, 80.0255],
  "Matara Bus Stand": [5.9549, 80.5550],
  "Matara": [5.9549, 80.5550]
};

// Component to dynamically re-center map when props change
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const RouteMap = ({ startName, endName, stops = [], activeRouteName = "Route Path" }) => {
  const startLatLng = CITY_COORDS[startName] || CITY_COORDS["Colombo"];
  const endLatLng = CITY_COORDS[endName] || CITY_COORDS["Kandy"];
  
  // Assemble route path lines
  const routePolyline = [
    startLatLng,
    ...stops.map(s => CITY_COORDS[s] || null).filter(c => c !== null),
    endLatLng
  ];

  const mapCenter = [
    (startLatLng[0] + endLatLng[0]) / 2,
    (startLatLng[1] + endLatLng[1]) / 2
  ];

  return (
    <div className="h-[400px] w-full rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative">
      <MapContainer 
        center={mapCenter} 
        zoom={8} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} />

        {/* Start Marker */}
        <Marker position={startLatLng} icon={createCustomMarker('#10b981', 'S')}>
          <Popup>
            <div className="font-semibold text-xs text-emerald-600">Start Point</div>
            <div className="font-bold text-slate-800">{startName}</div>
          </Popup>
        </Marker>

        {/* Intermediary Stops */}
        {stops.map((stop, i) => {
          const coords = CITY_COORDS[stop];
          if (!coords) return null;
          return (
            <Marker key={i} position={coords} icon={stopIcon}>
              <Popup>
                <div className="font-semibold text-[10px] text-slate-500">Stop {i + 1}</div>
                <div className="font-bold text-slate-800">{stop}</div>
              </Popup>
            </Marker>
          );
        })}

        {/* End Marker */}
        <Marker position={endLatLng} icon={createCustomMarker('#ef4444', 'E')}>
          <Popup>
            <div className="font-semibold text-xs text-rose-600">End Point</div>
            <div className="font-bold text-slate-800">{endName}</div>
          </Popup>
        </Marker>

        {/* Route Path Line */}
        <Polyline 
          positions={routePolyline} 
          pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.8, dashArray: '5, 10' }} 
        />
      </MapContainer>
      
      {/* Floating Info Box */}
      <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-darkbg-900/95 shadow-lg border border-slate-200 dark:border-slate-800 rounded-lg p-3 z-[1000] text-xs pointer-events-none">
        <h5 className="font-bold text-slate-800 dark:text-slate-100">{activeRouteName}</h5>
        <div className="flex space-x-4 mt-1.5 text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span>{startName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
            <span>{endName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
