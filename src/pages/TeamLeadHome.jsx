import React, { useState, useEffect, useRef } from "react";
import { useTeamLead } from "../contexts/TeamLeadContext";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Team member location map component
function TeamMemberLocationMap({ member }) {
  const mapRef = useRef();
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gpsLocation, setGpsLocation] = useState(null);

  // Generate a random GPS location within one of the 4 cells
  const generateGPSLocation = (cells) => {
    if (!cells || cells.length === 0) return null;
    
    // Pick a random cell from the 4 cells
    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    const bounds = L.geoJSON(randomCell).getBounds();
    
    // Generate a random point within the cell bounds
    const lat = bounds.getSouth() + (bounds.getNorth() - bounds.getSouth()) * Math.random();
    const lng = bounds.getWest() + (bounds.getEast() - bounds.getWest()) * Math.random();
    
    return { lat, lng };
  };

  // Function to select 4 contiguous cells (simplified version from OperatorHome)
  const selectFourCells = (features) => {
    if (features.length < 4) return features;
    
    // Filter out zero-risk cells
    const nonZeroRiskFeatures = features.filter(feature => 
      (feature.properties.risk || 0) > 0
    );
    
    const featuresPool = nonZeroRiskFeatures.length >= 4 ? nonZeroRiskFeatures : features;
    
    // Sort by risk and take first 4 (simplified for team lead view)
    const sortedFeatures = featuresPool
      .sort((a, b) => (b.properties.risk || 0) - (a.properties.risk || 0))
      .slice(0, 4);
    
    return sortedFeatures;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch risk data
        const response = await fetch('http://localhost:8000/risk-map/geojson/all-risk');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          // For team lead view, show any 4 cells with risk > 0
          const selectedCells = selectFourCells(data.features);
          
          const focusedData = {
            ...data,
            features: selectedCells
          };
          
          setRiskData(focusedData);
          
          // Generate GPS location within one of the cells
          const gps = generateGPSLocation(selectedCells);
          setGpsLocation(gps);
          
          // Fit map to the 4 cells
          setTimeout(() => {
            if (mapRef.current && selectedCells.length > 0) {
              const map = mapRef.current;
              const geoJsonLayer = L.geoJSON(focusedData);
              const bounds = geoJsonLayer.getBounds();
              if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [5, 5] });
              }
            }
          }, 500);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching map data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [member]);

  // Risk-based styling with proportional color intensity
  const getRiskBasedStyle = (feature) => {
    const risk = feature.properties.risk || 0;
    
    let fillColor, color;
    if (risk <= 0.3) {
      // Low risk - green shades with proportional intensity
      const intensity = risk / 0.3; // 0 to 1 within low risk range
      const greenValue = Math.floor(128 + (127 * intensity)); // 128 to 255
      fillColor = `rgb(0, ${greenValue}, 0)`;
      color = `rgb(0, ${Math.floor(greenValue * 0.7)}, 0)`;
    } else if (risk <= 0.6) {
      // Medium risk - yellow to orange shades with proportional intensity
      const intensity = (risk - 0.3) / 0.3; // 0 to 1 within medium risk range
      const redValue = Math.floor(200 + (55 * intensity)); // 200 to 255
      const greenValue = Math.floor(255 - (100 * intensity)); // 255 to 155
      fillColor = `rgb(${redValue}, ${greenValue}, 0)`;
      color = `rgb(${Math.floor(redValue * 0.8)}, ${Math.floor(greenValue * 0.8)}, 0)`;
    } else {
      // High risk - red shades with proportional intensity
      const intensity = Math.min((risk - 0.6) / 0.4, 1); // 0 to 1 within high risk range
      const redValue = Math.floor(180 + (75 * intensity)); // 180 to 255
      fillColor = `rgb(${redValue}, 0, 0)`;
      color = `rgb(${Math.floor(redValue * 0.8)}, 0, 0)`;
    }
    
    return {
      fillColor: fillColor,
      weight: 0,
      opacity: 0,
      color: color,
      fillOpacity: 0.3
    };
  };

  // Popup content for cells
  const onEachFeature = (feature, layer) => {
    const risk = feature.properties.risk || 0;
    const riskPercent = (risk * 100).toFixed(1);
    
    layer.bindPopup(`
      <div>
        <h4>Operational Cell</h4>
        <p><strong>Risk Level:</strong> ${riskPercent}%</p>
        <p><strong>Team Member:</strong> ${member}</p>
      </div>
    `);
  };

  if (loading) {
    return (
      <div className="w-full h-40 bg-gray-800 relative rounded flex items-center justify-center">
        <div className="text-gray-400">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-40 bg-gray-800 relative rounded overflow-hidden">
      <MapContainer 
        center={[49.76, 36.21]} 
        zoom={12} 
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Risk Data Overlay */}
        {riskData && (
          <GeoJSON
            key={`team-member-${member}-${riskData.features?.length}`}
            data={riskData}
            style={getRiskBasedStyle}
            onEachFeature={onEachFeature}
          />
        )}
        
        {/* GPS Location Dot */}
        {gpsLocation && (
          <Marker 
            position={[gpsLocation.lat, gpsLocation.lng]}
            icon={L.divIcon({
              className: 'gps-marker',
              html: '<div style="background-color: #ff0000; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(255,0,0,0.8);"></div>',
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })}
          >
            <Popup>
              <div>
                <h4>{member} GPS Location</h4>
                <p>Coordinates: {gpsLocation.lat.toFixed(4)}, {gpsLocation.lng.toFixed(4)}</p>
                <p>Status: Active in field</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Map overlay info */}
      <div style={{
        position: 'absolute',
        bottom: '5px',
        left: '5px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '3px 6px',
        borderRadius: '3px',
        fontSize: '10px'
      }}>
        Live GPS: {member}
      </div>
    </div>
  );
}

export default function TeamLeadHome() {
  const { assignments, partner } = useTeamLead();
  const [selected, setSelected] = useState(null);

  // Partner-specific information
  const getPartnerInfo = () => {
    const partnerData = {
      A: {
        region: "Western Kharkiv",
        focus: "Agricultural areas and rural settlements",
        riskLevel: "Moderate",
        priority: "Clear agricultural land for farming resumption"
      },
      B: {
        region: "Central Kharkiv", 
        focus: "Urban areas and transportation corridors",
        riskLevel: "High",
        priority: "Critical infrastructure and civilian safety"
      },
      C: {
        region: "Eastern Kharkiv",
        focus: "Industrial areas and border regions", 
        riskLevel: "Variable to High",
        priority: "Border security and industrial sites"
      }
    };
    return partnerData[partner] || partnerData.A;
  };

  const partnerInfo = getPartnerInfo();

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">Team Leader Overview</h1>
        <p className="text-gray-400">
          Managing Partner {partner} operations in {partnerInfo.region}
        </p>
      </header>

      {/* Partner Assignment Info */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Partner {partner} Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Operational Region</h3>
            <p className="text-gray-300">{partnerInfo.region}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Focus Areas</h3>
            <p className="text-gray-300">{partnerInfo.focus}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Risk Level</h3>
            <p className="text-gray-300">{partnerInfo.riskLevel}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Priority Mission</h3>
            <p className="text-gray-300">{partnerInfo.priority}</p>
          </div>
        </div>
      </div>

      {/* Team Status */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Team Status</h2>
        <ul className="space-y-4">
          {assignments.map((op, i) => (
            <li
              key={i}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-semibold text-lg">{op.member}</div>
                <div className="text-gray-300 text-sm">
                  {op.sectors.length > 0 
                    ? `Working on ${op.sectors.length} sectors: ${op.sectors.slice(0, 3).join(", ")}${op.sectors.length > 3 ? "..." : ""}`
                    : "Idle — waiting assignment"
                  }
                </div>
                {op.sectors.length > 0 && (
                  <div className="text-gray-400 text-xs mt-1">
                    Progress: {op.progress}% • Mines found: {op.mines}
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelected(op)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
              >
                Stats
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-700 p-6 rounded-lg w-full max-w-md space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{selected.member} Statistics</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Progress */}
            <div>
              <div className="text-sm text-gray-400">Progress</div>
              <div className="w-full bg-gray-600 h-3 rounded-full overflow-hidden mt-1">
                <div
                  className="h-3 bg-green-400"
                  style={{ width: `${selected.progress}%` }}
                />
              </div>
              <div className="text-right text-gray-300 text-sm mt-1">
                {selected.progress}%
              </div>
            </div>

            {/* Mines Discovered */}
            <div>
              <div className="text-sm text-gray-400">Mines Discovered</div>
              <div className="text-xl font-medium">{selected.mines}</div>
            </div>

            {/* Live Location & Sectors */}
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Live Location</div>
              <TeamMemberLocationMap member={selected.member} />
              <div className="text-sm text-gray-400">Assigned Sectors</div>
              <div className="text-gray-200">
                {selected.sectors.length > 0
                  ? selected.sectors.join(', ')
                  : 'None'}
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
