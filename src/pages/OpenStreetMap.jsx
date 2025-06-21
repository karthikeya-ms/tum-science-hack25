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

export default function OpenStreetMap() {
  const center = [49.76, 36.21];
  const mapRef = useRef();
  const [partnerAData, setPartnerAData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartnerAData = async () => {
      try {
        console.log('Fetching Partner A data...');
        setLoading(true);
        
        const response = await fetch('http://localhost:8000/risk-map/geojson?partner=A');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Partner A data received:', data);
        console.log('Features count:', data.features?.length || 0);
        
        if (data.features && data.features.length > 0) {
          // Optimize: Take only every 5th feature for faster rendering
          const optimizedData = {
            ...data,
            features: data.features.filter((_, index) => index % 5 === 0)
          };
          
          console.log('Optimized features count:', optimizedData.features.length, 'from original:', data.features.length);
          setPartnerAData(optimizedData);
          
          // Auto-fit bounds to show all Partner A data
          setTimeout(() => {
            if (mapRef.current) {
              const map = mapRef.current;
              const geoJsonLayer = L.geoJSON(data);
              const bounds = geoJsonLayer.getBounds();
              if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [20, 20] });
                console.log('Map fitted to Partner A bounds');
              }
            }
          }, 100);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching Partner A data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerAData();
  }, []);

  // Optimized style for better performance
  const geoJsonStyle = {
    fillColor: '#ff7800',
    weight: 1,
    opacity: 0.6,
    color: '#ff7800',
    fillOpacity: 0.4
  };

  const onEachFeature = (feature, layer) => {
    const risk = feature.properties.risk || 0;
    const riskPercent = (risk * 100).toFixed(1);
    const gridId = feature.properties.id || 'Unknown';
    
    layer.bindPopup(`
      <div>
        <h4>Partner A Region</h4>
        <p><strong>Grid ID:</strong> ${gridId}</p>
        <p><strong>Risk Level:</strong> ${riskPercent}%</p>
        <p><strong>Partner:</strong> ${feature.properties.partner}</p>
        <p><em>Showing sample of grid cells for performance</em></p>
      </div>
    `);
  };

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <MapContainer 
        center={center} 
        zoom={8} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        preferCanvas={true}
        updateWhenIdle={true}
        updateWhenZooming={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={center}>
          <Popup>
            Kharkiv Region - Humanitarian Demining
            <br />
            {loading && 'Loading Partner A data...'}
            {error && `Error: ${error}`}
            {!loading && !error && partnerAData && `Partner A: ${partnerAData.features?.length || 0} grid cells`}
          </Popup>
        </Marker>
        
        {partnerAData && !loading && (
          <GeoJSON
            key={`partner-a-${partnerAData.features?.length}`}
            data={partnerAData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
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
          Loading Partner A region...
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: '#ffcccc',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          border: '1px solid #ff0000'
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}