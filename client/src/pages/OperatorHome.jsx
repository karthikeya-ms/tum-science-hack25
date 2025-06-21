import React from "react";
import { MapContainer, Marker, Popup, TileLayer, LayersControl } from "react-leaflet";
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Simple barebone map component for operators
function OperatorMap() {
  const center = [49.76, 36.21]; // Kharkiv region center

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-600">
      <MapContainer 
        center={center} 
        zoom={8} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        preferCanvas={true}
        updateWhenIdle={true}
        updateWhenZooming={false}
      >
        <LayersControl position="topright">
          {/* Base Map Layers */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        <Marker position={center}>
          <Popup>
            Kharkiv Region - Operational Overview
            <br />
            General operational area for demining activities
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default function OperatorHome() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold">Operator Overview</h1>
        <p className="text-gray-400">General operational area and coordination hub</p>
      </header>

      {/* Map Section */}
      <section className="bg-gray-700 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="text-sm text-gray-400">Operational Region</div>
            <div className="text-xl font-semibold">Kharkiv Region</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Mission Status</div>
            <div className="text-xl font-semibold text-green-400">Active</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Coordination Level</div>
            <div className="text-xl font-semibold text-blue-400">Multi-Partner</div>
          </div>
        </div>
        <OperatorMap />
      </section>

      {/* Operational Control Center */}
      <section className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Control Center</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Mission Coordination</h3>
            <p className="text-gray-300">
              Central oversight of all demining operations across the region. 
              Monitoring progress and ensuring safety protocols.
            </p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Resource Management</h3>
            <p className="text-gray-300">
              Equipment allocation, personnel deployment, and logistics 
              coordination for optimal operational efficiency.
            </p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Safety Oversight</h3>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400">All Clear</span>
            </div>
            <p className="text-gray-300 text-sm">
              Continuous monitoring of safety protocols and emergency response readiness.
            </p>
          </div>
        </div>
      </section>

      {/* Communication Hub */}
      <section className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Communication Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Active Channels</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• Command & Control Center</li>
              <li>• Field Operations Teams</li>
              <li>• Emergency Response Units</li>
              <li>• International Coordination</li>
              <li>• Local Government Liaison</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Emergency Protocols</h3>
            <div className="text-gray-300 space-y-1">
              <div>Emergency Hotline: +380-XX-XXX-XXXX</div>
              <div>Medical Emergency: +380-XX-XXX-XXXX</div>
              <div>Evacuation Command: +380-XX-XXX-XXXX</div>
              <div>International Support: +380-XX-XXX-XXXX</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}