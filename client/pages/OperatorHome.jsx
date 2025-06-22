import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, LayersControl, GeoJSON } from "react-leaflet";
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Risk-based map component for operators with color intensity proportional to risk
function OperatorMap() {
  const center = [49.76, 36.21]; // Kharkiv region center
  const mapRef = useRef();
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [assignedLeader, setAssignedLeader] = useState(null);

  // Available leaders for random assignment
  const availableLeaders = ['A1', 'A2', 'A3', 'B1', 'B2', 'C1'];

  // Randomly assign a leader on component mount
  useEffect(() => {
    const randomLeader = availableLeaders[Math.floor(Math.random() * availableLeaders.length)];
    setAssignedLeader(randomLeader);
    console.log(`Operator assigned to Team Leader: ${randomLeader}`);
  }, []);

  // Fetch risk data from backend
  useEffect(() => {
    if (!assignedLeader) return; // Wait for leader assignment

    const fetchRiskData = async () => {
      try {
        console.log(`Fetching risk data for Team Leader ${assignedLeader}...`);
        setLoading(true);
        
        const response = await fetch('http://localhost:8000/risk-map/geojson/all-risk');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Risk data received:', data);
        console.log(`Features count:`, data.features?.length || 0);
        
        if (data.features && data.features.length > 0) {
          // Filter to show only the assigned leader's areas
          const leaderFeatures = data.features.filter(feature => 
            feature.properties.leader === assignedLeader
          );
          
          console.log(`Filtered features for Team Leader ${assignedLeader}:`, leaderFeatures.length);
          
          // Select only 4 cells in a 2x2 grid pattern
          const selectedCells = selectTwoByTwoGrid(leaderFeatures);
          
          const focusedData = {
            ...data,
            features: selectedCells
          };
          
          console.log(`Selected 2x2 grid cells:`, selectedCells.length);
          setRiskData(focusedData);
          
          setLoading(false);
          
          // Fit bounds after data loads - zoom to the 4 selected cells
          setTimeout(() => {
            setMapReady(true);
            if (mapRef.current && focusedData && focusedData.features.length > 0) {
              const map = mapRef.current;
              const geoJsonLayer = L.geoJSON(focusedData);
              const bounds = geoJsonLayer.getBounds();
              if (bounds.isValid()) {
                // Zoom in tightly to the 4 cells with minimal padding
                map.fitBounds(bounds, { padding: [10, 10], maxZoom: 16 });
                
                // Set minimum zoom to current zoom level to prevent zooming out
                const currentZoom = map.getZoom();
                map.setMinZoom(currentZoom - 1); // Allow slight zoom out but not much
                
                // Restrict panning to keep all cells visible
                // Add some padding to the bounds for pan restrictions
                const paddedBounds = bounds.pad(0.2); // 20% padding around the cells
                map.setMaxBounds(paddedBounds);
                
                console.log(`Map zoomed to 2x2 grid for Team Leader ${assignedLeader}`);
                console.log(`Minimum zoom set to: ${currentZoom - 1}`);
                console.log(`Pan bounds set to:`, paddedBounds);
              }
            }
          }, 1000);
        } else {
          setLoading(false);
        }
        
      } catch (err) {
        console.error('Error fetching risk data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRiskData();
  }, [assignedLeader]);

  // Function to select a 2x2 grid of cells from the available features
  const selectTwoByTwoGrid = (features) => {
    if (features.length < 4) return features; // Return all if less than 4
    
    // First, filter out cells with 0 risk
    const nonZeroRiskFeatures = features.filter(feature => 
      (feature.properties.risk || 0) > 0
    );
    
    console.log(`Features with non-zero risk: ${nonZeroRiskFeatures.length} out of ${features.length}`);
    
    // If we don't have enough non-zero risk features, use all features as fallback
    const featuresPool = nonZeroRiskFeatures.length >= 4 ? nonZeroRiskFeatures : features;
    
    // Calculate centers and create feature objects with spatial info
    const featuresWithCenters = featuresPool.map((feature, index) => {
      const bounds = L.geoJSON(feature).getBounds();
      const center = bounds.getCenter();
      const risk = feature.properties.risk || 0;
      return {
        feature,
        lat: center.lat,
        lng: center.lng,
        risk: risk,
        index
      };
    });
    
    // Function to check if two cells are adjacent (within cell size distance)
    const areAdjacent = (cell1, cell2) => {
      const latDiff = Math.abs(cell1.lat - cell2.lat);
      const lngDiff = Math.abs(cell1.lng - cell2.lng);
      // Cells are adjacent if they're within ~1.5km in either direction
      const threshold = 0.015; // Approximately 1.5km
      return (latDiff <= threshold && lngDiff <= threshold) && !(latDiff < 0.001 && lngDiff < 0.001);
    };
    
    // Function to find contiguous 2x2 grid starting from a seed cell
    const findContiguousGrid = (seedCell, allCells) => {
      // Find all cells adjacent to the seed
      const adjacent = allCells.filter(cell => 
        cell !== seedCell && areAdjacent(seedCell, cell)
      );
      
      if (adjacent.length < 3) return null; // Need at least 3 more cells
      
      // Try to form a 2x2 grid
      for (let i = 0; i < adjacent.length - 1; i++) {
        for (let j = i + 1; j < adjacent.length; j++) {
          const cell2 = adjacent[i];
          const cell3 = adjacent[j];
          
          // Find a fourth cell that's adjacent to both cell2 and cell3
          const cell4Candidates = allCells.filter(cell => 
            cell !== seedCell && cell !== cell2 && cell !== cell3 &&
            areAdjacent(cell, cell2) && areAdjacent(cell, cell3)
          );
          
          if (cell4Candidates.length > 0) {
            const cell4 = cell4Candidates[0];
            
            // Verify this forms a proper 2x2 grid (all cells should be connected)
            const grid = [seedCell, cell2, cell3, cell4];
            const isValidGrid = grid.every(cellA => 
              grid.some(cellB => cellB !== cellA && areAdjacent(cellA, cellB))
            );
            
            if (isValidGrid) {
              // Sort by risk (highest first) to prioritize higher risk areas
              grid.sort((a, b) => b.risk - a.risk);
              return grid;
            }
          }
        }
      }
      
      return null;
    };
    
    // Sort features by risk (highest first) to start with most important areas
    const sortedByRisk = featuresWithCenters.sort((a, b) => b.risk - a.risk);
    
    // Try to find a contiguous 2x2 grid starting from each high-risk cell
    for (const seedCell of sortedByRisk) {
      // Skip zero-risk seeds if we have non-zero options
      if (seedCell.risk === 0 && nonZeroRiskFeatures.length >= 4) continue;
      
      const grid = findContiguousGrid(seedCell, featuresWithCenters);
      if (grid) {
        const selected = grid.map(item => item.feature);
        console.log(`Selected contiguous 2x2 grid with risks: ${grid.map(f => f.risk.toFixed(3)).join(', ')}`);
        console.log(`Grid center coordinates: ${grid.map(f => `(${f.lat.toFixed(4)}, ${f.lng.toFixed(4)})`).join(', ')}`);
        return selected;
      }
    }
    
    // If no contiguous 2x2 grid found, fall back to closest 4 cells with highest risk
    console.log('No contiguous 2x2 grid found, selecting 4 closest high-risk cells');
    
    // Find the highest risk cell as anchor
    const anchor = sortedByRisk[0];
    
    // Find the 3 closest cells to the anchor
    const distances = featuresWithCenters
      .filter(cell => cell !== anchor && (nonZeroRiskFeatures.length < 4 || cell.risk > 0))
      .map(cell => ({
        cell,
        distance: Math.sqrt(
          Math.pow(cell.lat - anchor.lat, 2) + Math.pow(cell.lng - anchor.lng, 2)
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(item => item.cell);
    
    const fallbackGrid = [anchor, ...distances];
    const selected = fallbackGrid.map(item => item.feature);
    console.log(`Fallback selection with risks: ${fallbackGrid.map(f => f.risk.toFixed(3)).join(', ')}`);
    return selected;
  };

  // Handle map ready event
  const handleMapCreated = (map) => {
    mapRef.current = map;
    setTimeout(() => {
      map.invalidateSize();
      console.log('Initial map size invalidated');
    }, 100);
  };

  // Risk-based styling with color intensity proportional to risk level
  const getRiskBasedStyle = (feature) => {
    const risk = feature.properties.risk || 0;
    
    // Color intensity based on risk level (0-1)
    // Using a red-yellow-green color scale where:
    // - Green (low risk): 0.0-0.3
    // - Yellow (medium risk): 0.3-0.6  
    // - Red (high risk): 0.6-1.0
    
    let fillColor, color;
    let opacity = 0.8; // Add visible outlines
    let fillOpacity = 0.5; // Increased from 0.3 for better visibility
    
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
      weight: 2, // Add border weight
      opacity: opacity,
      color: color,
      fillOpacity: fillOpacity
    };
  };

  // Popup content for each feature
  const onEachFeature = (feature, layer) => {
    const risk = feature.properties.risk || 0;
    const riskPercent = (risk * 100).toFixed(1);
    const partner = feature.properties.partner || 'Unassigned';
    const leader = feature.properties.leader || 'Unassigned';
    
    // Risk level categorization
    let riskLevel;
    if (risk <= 0.3) {
      riskLevel = 'Low';
    } else if (risk <= 0.6) {
      riskLevel = 'Medium';
    } else {
      riskLevel = 'High';
    }
    
    layer.bindPopup(`
      <div>
        <h4>Risk Assessment</h4>
        <p><strong>Risk Level:</strong> ${riskPercent}% (${riskLevel})</p>
        <p><strong>Partner:</strong> ${partner}</p>
        <p><strong>Team Leader:</strong> ${leader}</p>
        <p><em>Color intensity reflects risk level</em></p>
      </div>
    `);
  };

  // Calculate risk statistics
  const getRiskStats = () => {
    if (!riskData?.features) return null;
    
    const risks = riskData.features.map(f => f.properties.risk || 0);
    const totalAreas = risks.length;
    const avgRisk = risks.reduce((a, b) => a + b, 0) / totalAreas;
    const maxRisk = Math.max(...risks);
    const minRisk = Math.min(...risks);
    
    const lowRisk = risks.filter(r => r <= 0.3).length;
    const mediumRisk = risks.filter(r => r > 0.3 && r <= 0.6).length;
    const highRisk = risks.filter(r => r > 0.6).length;
    
    return {
      totalAreas,
      avgRisk,
      maxRisk,
      minRisk,
      lowRisk,
      mediumRisk,
      highRisk
    };
  };

  const stats = getRiskStats();

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-600 relative">
      <MapContainer 
        center={center} 
        zoom={8} 
        minZoom={12}
        maxZoom={18}
        maxBounds={[[49.5, 35.8], [50.0, 36.6]]}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        ref={handleMapCreated}
        preferCanvas={true}
        updateWhenIdle={true}
        updateWhenZooming={false}
        whenReady={() => {
          console.log('Risk map is ready');
          setTimeout(() => setMapReady(true), 200);
        }}
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

          {/* Risk Data Overlay for Assigned Leader */}
          {riskData && !loading && mapReady && assignedLeader && (
            <LayersControl.Overlay checked name={`Team Leader ${assignedLeader} - Focus Area (4 Cells)`}>
              <GeoJSON
                key={`risk-data-${assignedLeader}-${riskData.features?.length}-${mapReady}`}
                data={riskData}
                style={getRiskBasedStyle}
                onEachFeature={onEachFeature}
                onAdd={() => console.log(`GeoJSON layer added for Team Leader ${assignedLeader} with ${riskData.features?.length} features`)}
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>
      </MapContainer>
      
      {loading && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          Loading Team Leader {assignedLeader} focus area...
        </div>
      )}
      
      {!loading && stats && assignedLeader && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          minWidth: '200px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>Team Leader {assignedLeader} - Focus Area</h4>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#00FF00' }}>🟢</span> Low Risk (0-30%): {stats.lowRisk} cells
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#FFA500' }}>🟡</span> Medium Risk (30-60%): {stats.mediumRisk} cells
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#FF0000' }}>🔴</span> High Risk (60-100%): {stats.highRisk} cells
          </div>
          <div style={{ fontSize: '11px', fontStyle: 'italic', opacity: 0.8 }}>
            Showing 2x2 grid focus area ({stats.totalAreas} cells)
          </div>
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          background: '#ffcccc',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          border: '1px solid #ff0000',
          fontSize: '12px'
        }}>
          Error loading risk data: {error}
        </div>
      )}
    </div>
  );
}

export default function OperatorHome() {
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
      <div className="relative z-10 max-w-4xl mx-auto space-y-8 text-white p-6">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-white">Operator Overview</h1>
          <p className="text-teal-300">General operational area and coordination hub</p>
        </header>

        {/* Map Section */}
        <section className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <div className="text-sm text-teal-300">Operational Region</div>
              <div className="text-xl font-semibold text-white">Kharkiv Region</div>
            </div>
            <div>
              <div className="text-sm text-teal-300">Mission Status</div>
              <div className="text-xl font-semibold text-teal-400">Active</div>
            </div>
            <div>
              <div className="text-sm text-teal-300">Coordination Level</div>
              <div className="text-xl font-semibold text-green-400">Multi-Partner</div>
            </div>
          </div>
          <OperatorMap />
        </section>

        {/* Operational Control Center */}
        <section className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Control Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-lg mb-2 text-white">Mission Coordination</h3>
              <p className="text-gray-300">
                Central oversight of all demining operations across the region. 
                Monitoring progress and ensuring safety protocols.
              </p>
            </div>
            
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-lg mb-2 text-white">Resource Management</h3>
              <p className="text-gray-300">
                Equipment allocation, personnel deployment, and logistics 
                coordination for optimal operational efficiency.
              </p>
            </div>
            
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-lg mb-2 text-white">Safety Oversight</h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                <span className="text-teal-400">All Clear</span>
              </div>
              <p className="text-gray-300 text-sm">
                Continuous monitoring of safety protocols and emergency response readiness.
              </p>
            </div>
          </div>
        </section>

        {/* Communication Hub */}
        <section className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Communication Hub</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-lg mb-2 text-white">Active Channels</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Command & Control Center</li>
                <li>• Field Operations Teams</li>
                <li>• Emergency Response Units</li>
                <li>• International Coordination</li>
                <li>• Local Government Liaison</li>
              </ul>
            </div>
            
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-lg mb-2 text-white">Emergency Protocols</h3>
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
    </div>
  );
}