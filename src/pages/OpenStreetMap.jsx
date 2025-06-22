import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map resize after mount
function MapResizer() {
  const map = L.DomUtil.get('map');
  
  useEffect(() => {
    const mapInstance = window.mapInstance;
    if (mapInstance) {
      // Force map to recalculate size
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 100);
    }
  }, []);
  
  return null;
}

export default function OpenStreetMap({ 
  partners = ['A', 'B', 'C'], // Default to all partners
  showLegend = true,
  title = "Humanitarian Demining",
  filterLeadersByPartner = null, // New prop to filter leaders by partner
  riskData = null, // New prop for risk-based data overlay
  getRiskBasedStyle = null, // New prop for risk-based styling function
  onEachRiskFeature = null, // New prop for risk feature popup handler
  riskLoading = false // New prop for risk data loading state
}) {
  const center = [49.76, 36.21];
  const mapRef = useRef();
  const [partnerAData, setPartnerAData] = useState(null);
  const [partnerBData, setPartnerBData] = useState(null);
  const [partnerCData, setPartnerCData] = useState(null);
  const [leaderData, setLeaderData] = useState({}); // New state for leader data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState({
    A: false,
    B: false,
    C: false,
    leaders: false // New loading status for leaders
  });
  const [mapReady, setMapReady] = useState(false);
  const [terrainInfo, setTerrainInfo] = useState(null);
  const [clickedCoords, setClickedCoords] = useState(null);

  // Define which leaders belong to which partners
  const partnerLeaders = {
    'A': ['A1', 'A2', 'A3'],
    'B': ['B1', 'B2'],
    'C': ['C1']
  };

  // Get filtered leaders based on current partner
  const getFilteredLeaders = () => {
    if (!filterLeadersByPartner) {
      // If no filter, show all leaders
      return Object.values(partnerLeaders).flat();
    }
    // Return only leaders for the specified partner
    return partnerLeaders[filterLeadersByPartner] || [];
  };

  const filteredLeaders = getFilteredLeaders();

  // Normalize partners prop to always be an array
  const activePartners = Array.isArray(partners) ? partners : [partners];

  // Force map to invalidate size when data changes
  useEffect(() => {
    if (mapRef.current && mapReady) {
      const timer = setTimeout(() => {
        mapRef.current.invalidateSize();
        console.log('Map size invalidated after data change');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [partnerAData, partnerBData, partnerCData, leaderData, mapReady]);

  // // Function to get terrain information for coordinates
  // const getTerrainInfo = async (lat, lng) => {
  //   try {
  //     // Using Open-Elevation API for elevation data
  //     const elevationResponse = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
  //     const elevationData = await elevationResponse.json();
      
  //     // Using OpenWeatherMap Geocoding API for location details (you might want to add your API key)
  //     const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=YOUR_API_KEY_HERE`);
      
  //     let locationData = null;
  //     if (geoResponse.ok) {
  //       const geoData = await geoResponse.json();
  //       locationData = geoData[0];
  //     }

  //     // Simple terrain classification based on elevation
  //     const elevation = elevationData.results[0]?.elevation || 0;
  //     let terrainType = 'Unknown';
      
  //     if (elevation < 100) {
  //       terrainType = 'Lowland/Plain';
  //     } else if (elevation < 300) {
  //       terrainType = 'Rolling Hills';
  //     } else if (elevation < 600) {
  //       terrainType = 'Hills';
  //     } else {
  //       terrainType = 'Mountainous';
  //     }

  //     return {
  //       latitude: lat,
  //       longitude: lng,
  //       elevation: elevation,
  //       terrainType: terrainType,
  //       location: locationData ? `${locationData.name}, ${locationData.country}` : 'Unknown Location'
  //     };
  //   } catch (error) {
  //     console.error('Error fetching terrain info:', error);
  //     return {
  //       latitude: lat,
  //       longitude: lng,
  //       elevation: 'N/A',
  //       terrainType: 'Unknown',
  //       location: 'Error fetching location data',
  //       error: error.message
  //     };
  //   }
  // };

  // // Handle map click to get terrain info
  // const handleMapClick = async (e) => {
  //   const { lat, lng } = e.latlng;
  //   setClickedCoords({ lat, lng });
  //   setTerrainInfo({ loading: true });
    
  //   const info = await getTerrainInfo(lat, lng);
  //   setTerrainInfo(info);
  // };

  useEffect(() => {
    const fetchPartnerData = async (partner) => {
      try {
        console.log(`Fetching Partner ${partner} data...`);
        setLoadingStatus(prev => ({ ...prev, [partner]: true }));
        
        const response = await fetch(`http://localhost:8000/risk-map/geojson?partner=${partner}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Partner ${partner} data received:`, data);
        console.log(`Features count for Partner ${partner}:`, data.features?.length || 0);
        
        if (data.features && data.features.length > 0) {
          // Use all features without skipping for efficiency
          const fullData = {
            ...data,
            features: data.features
          };
          
          console.log(`Full features count for Partner ${partner}:`, fullData.features.length);
          
          // Set data based on partner
          if (partner === 'A') {
            setPartnerAData(fullData);
          } else if (partner === 'B') {
            setPartnerBData(fullData);
          } else if (partner === 'C') {
            setPartnerCData(fullData);
          }
        }
        
        setLoadingStatus(prev => ({ ...prev, [partner]: false }));
      } catch (err) {
        console.error(`Error fetching Partner ${partner} data:`, err);
        setError(prev => ({ ...prev, [partner]: err.message }));
        setLoadingStatus(prev => ({ ...prev, [partner]: false }));
      }
    };

    const fetchLeaderData = async () => {
      try {
        console.log('Fetching Leader data...');
        setLoadingStatus(prev => ({ ...prev, leaders: true }));
        
        const response = await fetch('http://localhost:8000/risk-map/geojson/leaders');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leader data received:', data);
        
        // Use all leader data without skipping for efficiency
        // Only process leaders that are in the filtered list
        const fullLeaderData = {};
        filteredLeaders.forEach(leader => {
          if (data[leader] && data[leader].features && data[leader].features.length > 0) {
            fullLeaderData[leader] = {
              ...data[leader],
              features: data[leader].features
            };
            console.log(`Full features count for Leader ${leader}:`, fullLeaderData[leader].features.length);
          }
        });
        
        setLeaderData(fullLeaderData);
        setLoadingStatus(prev => ({ ...prev, leaders: false }));
      } catch (err) {
        console.error('Error fetching Leader data:', err);
        setError(prev => ({ ...prev, leaders: err.message }));
        setLoadingStatus(prev => ({ ...prev, leaders: false }));
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      setError({});
      setMapReady(false);
      
      // Reset data for partners not in activePartners
      if (!activePartners.includes('A')) setPartnerAData(null);
      if (!activePartners.includes('B')) setPartnerBData(null);
      if (!activePartners.includes('C')) setPartnerCData(null);
      
      // Fetch data for active partners and leaders
      const fetchPromises = [
        ...activePartners.map(partner => fetchPartnerData(partner)),
        fetchLeaderData() // Add leader data fetching
      ];
      await Promise.all(fetchPromises);
      
      setLoading(false);
      
      // Wait a bit longer before fitting bounds to ensure map is ready
      setTimeout(() => {
        setMapReady(true);
        if (mapRef.current) {
          const map = mapRef.current;
          let allBounds = null;
          
          // Combine bounds from active partners that have data
          const dataToCheck = [];
          if (activePartners.includes('A') && partnerAData) dataToCheck.push(partnerAData);
          if (activePartners.includes('B') && partnerBData) dataToCheck.push(partnerBData);
          if (activePartners.includes('C') && partnerCData) dataToCheck.push(partnerCData);
          
          // Also include leader data for bounds calculation
          Object.values(leaderData).forEach(data => {
            if (data && data.features) {
              dataToCheck.push(data);
            }
          });
          
          dataToCheck.forEach(data => {
            if (data && data.features) {
              const geoJsonLayer = L.geoJSON(data);
              const bounds = geoJsonLayer.getBounds();
              if (bounds.isValid()) {
                if (!allBounds) {
                  allBounds = bounds;
                } else {
                  allBounds.extend(bounds);
                }
              }
            }
          });
          
          if (allBounds && allBounds.isValid()) {
            map.fitBounds(allBounds, { padding: [20, 20] });
            console.log('Map fitted to active partners bounds');
          }
        }
      }, 1000); // Increased delay to ensure everything is rendered
    };

    fetchAllData();
  }, [activePartners.join(','), filteredLeaders.join(',')]); // Re-run when partners or filtered leaders change

  // Handle map ready event
  const handleMapCreated = (map) => {
    mapRef.current = map;
    // Force initial size calculation
    setTimeout(() => {
      map.invalidateSize();
      console.log('Initial map size invalidated');
    }, 100);
  };

  // Different styles for each partner - no visible outlines
  const getGeoJsonStyle = (partner) => {
    const styles = {
      A: {
        fillColor: '#ff0000',
        weight: 0,
        opacity: 0,
        color: '#ff0000',
        fillOpacity: 0.4
      },
      B: {
        fillColor: '#0000ff',
        weight: 0,
        opacity: 0,
        color: '#0000ff',
        fillOpacity: 0.4
      },
      C: {
        fillColor: '#000000',
        weight: 0,
        opacity: 0,
        color: '#000000',
        fillOpacity: 0.4
      }
    };
    return styles[partner] || styles.A;
  };

  // Different styles for each leader - no visible outlines
  const getLeaderGeoJsonStyle = (leader) => {
    const styles = {
      // Partner A leaders - shades of red
      'A1': {
        fillColor: '#ff4444',
        weight: 0,
        opacity: 0,
        color: '#cc0000',
        fillOpacity: 0.5
      },
      'A2': {
        fillColor: '#ff7777',
        weight: 0,
        opacity: 0,
        color: '#cc0000',
        fillOpacity: 0.5
      },
      'A3': {
        fillColor: '#ffaaaa',
        weight: 0,
        opacity: 0,
        color: '#cc0000',
        fillOpacity: 0.5
      },
      // Partner B leaders - shades of blue
      'B1': {
        fillColor: '#4444ff',
        weight: 0,
        opacity: 0,
        color: '#0000cc',
        fillOpacity: 0.5
      },
      'B2': {
        fillColor: '#7777ff',
        weight: 0,
        opacity: 0,
        color: '#0000cc',
        fillOpacity: 0.5
      },
      // Partner C leaders - shades of green
      'C1': {
        fillColor: '#44ff44',
        weight: 0,
        opacity: 0,
        color: '#00cc00',
        fillOpacity: 0.5
      }
    };
    return styles[leader] || {
      fillColor: '#888888',
      weight: 0,
      opacity: 0,
      color: '#666666',
      fillOpacity: 0.5
    };
  };

  const onEachFeature = (partner) => (feature, layer) => {
    const risk = feature.properties.risk || 0;
    const riskPercent = (risk * 100).toFixed(1);
    const gridId = feature.properties.id || 'Unknown';
    
    layer.bindPopup(`
      <div>
        <h4>Partner ${partner} Region</h4>
        <p><strong>Grid ID:</strong> ${gridId}</p>
        <p><strong>Risk Level:</strong> ${riskPercent}%</p>
        <p><strong>Partner:</strong> ${feature.properties.partner || partner}</p>
        <p><em>All operational grid cells displayed</em></p>
      </div>
    `);
  };

  const onEachLeaderFeature = (leader) => (feature, layer) => {
    const risk = feature.properties.risk || 0;
    const riskPercent = (risk * 100).toFixed(1);
    const gridId = feature.properties.id || 'Unknown';
    const partner = feature.properties.partner || 'Unknown';
    
    layer.bindPopup(`
      <div>
        <h4>Leader ${leader} Region</h4>
        <p><strong>Grid ID:</strong> ${gridId}</p>
        <p><strong>Risk Level:</strong> ${riskPercent}%</p>
        <p><strong>Partner:</strong> ${partner}</p>
        <p><strong>Leader:</strong> ${leader}</p>
        <p><em>All operational grid cells displayed</em></p>
      </div>
    `);
  };

  const getTotalFeatures = () => {
    let total = 0;
    if (activePartners.includes('A') && partnerAData) total += partnerAData.features?.length || 0;
    if (activePartners.includes('B') && partnerBData) total += partnerBData.features?.length || 0;
    if (activePartners.includes('C') && partnerCData) total += partnerCData.features?.length || 0;
    
    // Add leader data features
    Object.values(leaderData).forEach(data => {
      if (data && data.features) {
        total += data.features.length;
      }
    });
    
    // Add risk data features
    if (riskData && riskData.features) {
      total += riskData.features.length;
    }
    
    return total;
  };

  const getActiveLoadingPartners = () => {
    return activePartners.filter(partner => loadingStatus[partner]);
  };

  // Create a unique key for the map to force re-render when needed
  const mapKey = `map-${activePartners.join('-')}-${getTotalFeatures()}-${Object.keys(leaderData).length}`;

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-600 relative">
      {/* <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-600"></div> */}
      
      <MapContainer 
        key={mapKey}
        center={center} 
        zoom={8} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        ref={handleMapCreated}
        preferCanvas={true}
        updateWhenIdle={true}
        updateWhenZooming={false}
        whenReady={() => {
          console.log('Map is ready');
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

          <LayersControl.BaseLayer name="Satellite (Esri)">
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

          <LayersControl.BaseLayer name="Dark Mode">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          {/* Partner Data Overlays */}
          {activePartners.includes('A') && partnerAData && !loadingStatus.A && mapReady && (
            <LayersControl.Overlay checked name="Partner A Data">
              <GeoJSON
                key={`partner-a-${partnerAData.features?.length}-${mapReady}`}
                data={partnerAData}
                style={getGeoJsonStyle('A')}
                onEachFeature={onEachFeature('A')}
              />
            </LayersControl.Overlay>
          )}
          
          {activePartners.includes('B') && partnerBData && !loadingStatus.B && mapReady && (
            <LayersControl.Overlay checked name="Partner B Data">
              <GeoJSON
                key={`partner-b-${partnerBData.features?.length}-${mapReady}`}
                data={partnerBData}
                style={getGeoJsonStyle('B')}
                onEachFeature={onEachFeature('B')}
              />
            </LayersControl.Overlay>
          )}
          
          {activePartners.includes('C') && partnerCData && !loadingStatus.C && mapReady && (
            <LayersControl.Overlay checked name="Partner C Data">
              <GeoJSON
                key={`partner-c-${partnerCData.features?.length}-${mapReady}`}
                data={partnerCData}
                style={getGeoJsonStyle('C')}
                onEachFeature={onEachFeature('C')}
              />
            </LayersControl.Overlay>
          )}

          {/* Leader Data Overlays */}
          {filteredLeaders.map(leader => (
            leaderData[leader] && !loadingStatus.leaders && mapReady && (
              <LayersControl.Overlay key={leader} name={`Leader ${leader}`}>
                <GeoJSON
                  key={`leader-${leader}-${leaderData[leader].features?.length}-${mapReady}`}
                  data={leaderData[leader]}
                  style={getLeaderGeoJsonStyle(leader)}
                  onEachFeature={onEachLeaderFeature(leader)}
                />
              </LayersControl.Overlay>
            )
          ))}

          {/* Risk Data Overlay */}
          {riskData && getRiskBasedStyle && onEachRiskFeature && !riskLoading && mapReady && (
            <LayersControl.Overlay name={`Partner ${filterLeadersByPartner || 'All'} Risk Assessment`}>
              <GeoJSON
                key={`risk-data-${riskData.features?.length}-${mapReady}`}
                data={riskData}
                style={getRiskBasedStyle}
                onEachFeature={onEachRiskFeature}
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
          Loading partner data...
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            {getActiveLoadingPartners().map(partner => (
              <div key={partner}>Loading Partner {partner}...</div>
            ))}
            {loadingStatus.leaders && <div>Loading Leaders...</div>}
            {riskLoading && <div>Loading Risk Assessment...</div>}
          </div>
        </div>
      )}
      
      {!loading && showLegend && activePartners.length > 1 && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Partners Legend:</h4>
          <div style={{ fontSize: '12px' }}>
            {activePartners.includes('A') && <div style={{ color: '#ff0000', marginBottom: '2px' }}>● Partner A (Red)</div>}
            {activePartners.includes('B') && <div style={{ color: '#0000ff', marginBottom: '2px' }}>● Partner B (Blue)</div>}
            {activePartners.includes('C') && <div style={{ color: '#000000' }}>● Partner C (Black)</div>}
          </div>
        </div>
      )}
      
      {Object.values(error || {}).length > 0 && (
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
          <div>Errors occurred:</div>
          {Object.entries(error || {}).filter(([partner]) => activePartners.includes(partner)).map(([partner, err]) => (
            <div key={partner}>Partner {partner}: {err}</div>
          ))}
        </div>
      )}
    </div>
  );
}