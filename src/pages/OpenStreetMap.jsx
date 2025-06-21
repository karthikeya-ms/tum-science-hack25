import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
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
  title = "Humanitarian Demining"
}) {
  const center = [49.76, 36.21];
  const mapRef = useRef();
  const [partnerAData, setPartnerAData] = useState(null);
  const [partnerBData, setPartnerBData] = useState(null);
  const [partnerCData, setPartnerCData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState({
    A: false,
    B: false,
    C: false
  });
  const [mapReady, setMapReady] = useState(false);

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
  }, [partnerAData, partnerBData, partnerCData, mapReady]);

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
          // Optimize: Take only every 5th feature for faster rendering
          const optimizedData = {
            ...data,
            features: data.features.filter((_, index) => index % 5 === 0)
          };
          
          console.log(`Optimized features count for Partner ${partner}:`, optimizedData.features.length, 'from original:', data.features.length);
          
          // Set data based on partner
          if (partner === 'A') {
            setPartnerAData(optimizedData);
          } else if (partner === 'B') {
            setPartnerBData(optimizedData);
          } else if (partner === 'C') {
            setPartnerCData(optimizedData);
          }
        }
        
        setLoadingStatus(prev => ({ ...prev, [partner]: false }));
      } catch (err) {
        console.error(`Error fetching Partner ${partner} data:`, err);
        setError(prev => ({ ...prev, [partner]: err.message }));
        setLoadingStatus(prev => ({ ...prev, [partner]: false }));
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
      
      // Fetch data only for active partners
      const fetchPromises = activePartners.map(partner => fetchPartnerData(partner));
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
  }, [activePartners.join(',')]); // Re-run when partners change

  // Handle map ready event
  const handleMapCreated = (map) => {
    mapRef.current = map;
    // Force initial size calculation
    setTimeout(() => {
      map.invalidateSize();
      console.log('Initial map size invalidated');
    }, 100);
  };

  // Different styles for each partner
  const getGeoJsonStyle = (partner) => {
    const styles = {
      A: {
        fillColor: '#ff0000',
        weight: 1,
        opacity: 0.6,
        color: '#ff0000',
        fillOpacity: 0.4
      },
      B: {
        fillColor: '#0000ff',
        weight: 1,
        opacity: 0.6,
        color: '#0000ff',
        fillOpacity: 0.4
      },
      C: {
        fillColor: '#000000',
        weight: 1,
        opacity: 0.6,
        color: '#000000',
        fillOpacity: 0.4
      }
    };
    return styles[partner] || styles.A;
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
        <p><em>Showing sample of grid cells for performance</em></p>
      </div>
    `);
  };

  const getTotalFeatures = () => {
    let total = 0;
    if (activePartners.includes('A') && partnerAData) total += partnerAData.features?.length || 0;
    if (activePartners.includes('B') && partnerBData) total += partnerBData.features?.length || 0;
    if (activePartners.includes('C') && partnerCData) total += partnerCData.features?.length || 0;
    return total;
  };

  const getActiveLoadingPartners = () => {
    return activePartners.filter(partner => loadingStatus[partner]);
  };

  // Create a unique key for the map to force re-render when needed
  const mapKey = `map-${activePartners.join('-')}-${getTotalFeatures()}`;

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-600">
      
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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={center}>
          <Popup>
            Kharkiv Region - {title}
            <br />
            {loading && 'Loading partner data...'}
            {Object.values(error || {}).length > 0 && `Errors: ${Object.entries(error || {}).map(([k,v]) => `${k}: ${v}`).join(', ')}`}
            {!loading && getTotalFeatures() > 0 && (
              <div>
                <div>Total grid cells: {getTotalFeatures()}</div>
                {activePartners.includes('A') && partnerAData && <div style={{color: '#ff0000'}}>Partner A: {partnerAData.features?.length || 0} cells</div>}
                {activePartners.includes('B') && partnerBData && <div style={{color: '#0000ff'}}>Partner B: {partnerBData.features?.length || 0} cells</div>}
                {activePartners.includes('C') && partnerCData && <div style={{color: '#000000'}}>Partner C: {partnerCData.features?.length || 0} cells</div>}
              </div>
            )}
          </Popup>
        </Marker>
        
        {/* Render Partner A data only if A is in activePartners and map is ready */}
        {activePartners.includes('A') && partnerAData && !loadingStatus.A && mapReady && (
          <GeoJSON
            key={`partner-a-${partnerAData.features?.length}-${mapReady}`}
            data={partnerAData}
            style={getGeoJsonStyle('A')}
            onEachFeature={onEachFeature('A')}
          />
        )}
        
        {/* Render Partner B data only if B is in activePartners and map is ready */}
        {activePartners.includes('B') && partnerBData && !loadingStatus.B && mapReady && (
          <GeoJSON
            key={`partner-b-${partnerBData.features?.length}-${mapReady}`}
            data={partnerBData}
            style={getGeoJsonStyle('B')}
            onEachFeature={onEachFeature('B')}
          />
        )}
        
        {/* Render Partner C data only if C is in activePartners and map is ready */}
        {activePartners.includes('C') && partnerCData && !loadingStatus.C && mapReady && (
          <GeoJSON
            key={`partner-c-${partnerCData.features?.length}-${mapReady}`}
            data={partnerCData}
            style={getGeoJsonStyle('C')}
            onEachFeature={onEachFeature('C')}
          />
        )}
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