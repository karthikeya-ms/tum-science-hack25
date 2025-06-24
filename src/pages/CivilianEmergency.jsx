import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red emergency marker
const emergencyIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="24" height="24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function CivilianEmergency({ onBack }) {
  const [reports, setReports] = useState([
    { 
      id: 1,
      date: "2025-06-21", 
      text: "Suspicious object found near playground",
      location: { lat: 49.7648, lng: 36.2102 },
      reporterName: "Maria K.",
      status: "Reported"
    },
    { 
      id: 2,
      date: "2025-06-20", 
      text: "Unexploded device in residential area",
      location: { lat: 49.7598, lng: 36.2052 },
      reporterName: "Viktor S.",
      status: "Under Investigation"
    },
  ]);
  
  const [newReport, setNewReport] = useState({
    description: "",
    reporterName: "",
    contactInfo: "",
    location: null
  });

  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef();

  const handleLocationSelect = (latlng) => {
    setNewReport(prev => ({
      ...prev,
      location: { lat: latlng.lat, lng: latlng.lng }
    }));
    setShowMap(false);
  };

  const submitReport = () => {
    if (!newReport.description.trim() || !newReport.reporterName.trim() || !newReport.location) {
      alert("Please fill all required fields and select a location on the map");
      return;
    }

    const report = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      text: newReport.description,
      location: newReport.location,
      reporterName: newReport.reporterName,
      contactInfo: newReport.contactInfo,
      status: "Reported"
    };

    setReports([report, ...reports]);
    setNewReport({
      description: "",
      reporterName: "",
      contactInfo: "",
      location: null
    });
    
    alert("Emergency report submitted successfully! Authorities have been notified.");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0f1f2e 20%, #1e364e 100%)",
        }}
      />
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          backgroundImage:
            "linear-gradient(rgba(64,224,208,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,208,0.12) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          animation: "gridPulse 4s ease-in-out infinite alternate",
        }}
      />
      
      {/* Add custom keyframes for grid animation */}
      <style jsx>{`
        @keyframes gridPulse {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-8 text-white p-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white"> Emergency Report</h1>
            <p className="text-teal-300">
              Report suspicious objects or potential unexploded ordnance
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg transition"
          >
            ← Back to Login
          </button>
        </header>

        {/* Safety Warning */}
        <div className="bg-red-900 bg-opacity-50 border border-red-500 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-red-300 mb-3">⚠️ SAFETY WARNING</h2>
          <div className="text-red-100 space-y-2">
            <p><strong>DO NOT TOUCH</strong> any suspicious objects</p>
            <p><strong>DO NOT MOVE</strong> anything that looks unusual</p>
            <p><strong>KEEP DISTANCE</strong> of at least 100 meters</p>
            <p><strong>EVACUATE</strong> the area immediately</p>
            <p><strong>REPORT</strong> the location using this form</p>
          </div>
        </div>

        {/* Emergency Contact Info */}
        <div className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-red-400 mb-2">🚨 IMMEDIATE DANGER</h3>
              <p className="text-white text-lg font-bold">📞 112</p>
              <p className="text-gray-300 text-sm">Emergency Services</p>
            </div>
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-orange-400 mb-2">💣 Explosive Ordnance</h3>
              <p className="text-white text-lg font-bold">📞 +380-XX-XXX-XXXX</p>
              <p className="text-gray-300 text-sm">Demining Hotline</p>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <div className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Submit Emergency Report</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-teal-300 text-sm font-medium mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={newReport.reporterName}
                  onChange={(e) => setNewReport(prev => ({ ...prev, reporterName: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full bg-[#27323e] border border-teal-500/20 text-white py-2 px-3 rounded-lg placeholder-gray-400 focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-teal-300 text-sm font-medium mb-2">
                  Contact Information
                </label>
                <input
                  type="text"
                  value={newReport.contactInfo}
                  onChange={(e) => setNewReport(prev => ({ ...prev, contactInfo: e.target.value }))}
                  placeholder="Phone number or email"
                  className="w-full bg-[#27323e] border border-teal-500/20 text-white py-2 px-3 rounded-lg placeholder-gray-400 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-teal-300 text-sm font-medium mb-2">
                Description of Object/Situation *
              </label>
              <textarea
                value={newReport.description}
                onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what you found, where you found it, and any other relevant details..."
                className="w-full bg-[#27323e] border border-teal-500/20 text-white py-3 px-3 rounded-lg placeholder-gray-400 focus:outline-none focus:border-teal-400"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-teal-300 text-sm font-medium mb-2">
                Location *
              </label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white px-4 py-2 rounded-lg transition"
                >
                  📍 Select Location on Map
                </button>
                {newReport.location && (
                  <div className="flex items-center text-green-400">
                    ✓ Location selected: {newReport.location.lat.toFixed(4)}, {newReport.location.lng.toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={submitReport}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-lg font-semibold transition"
            >
              🚨 Submit Emergency Report
            </button>
          </div>
        </div>

        {/* Map Modal */}
        {showMap && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-[#1f2a36] p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Click on the map to mark the location</h3>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={[49.76, 36.21]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onLocationSelect={handleLocationSelect} />
                  {newReport.location && (
                    <Marker 
                      position={[newReport.location.lat, newReport.location.lng]}
                      icon={emergencyIcon}
                    >
                      <Popup>
                        <div>
                          <h4>Selected Location</h4>
                          <p>Lat: {newReport.location.lat.toFixed(4)}</p>
                          <p>Lng: {newReport.location.lng.toFixed(4)}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
        )}

        {/* Previous Reports */}
        <div className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Emergency Reports</h2>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-gray-300 text-sm">{report.date}</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      report.status === 'Reported' ? 'bg-yellow-900 text-yellow-300' :
                      report.status === 'Under Investigation' ? 'bg-blue-900 text-blue-300' :
                      'bg-green-900 text-green-300'
                    }`}>
                      {report.status}
                    </div>
                  </div>
                  <div className="text-white mb-2">{report.text}</div>
                  <div className="text-gray-400 text-sm">
                    Reported by: {report.reporterName} | 
                    Location: {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No reports submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
} 