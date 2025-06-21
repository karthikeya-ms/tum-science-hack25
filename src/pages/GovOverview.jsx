// src/pages/GovOverview.jsx
import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import OpenStreetMap from "./OpenStreetMap";

export default function GovOverview() {
  const stats = [
    { label: "Area Cleared", value: "45 000 ha" },
    { label: "Population Impacted", value: "600 000" },
    { label: "Economic Value", value: "$80 M" },
  ];

  const [mapSrc, setMapSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);

  // Fetch full risk data for government overview
  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    try {
      console.log('Fetching full risk data for Government Overview...');
      setRiskLoading(true);
      
      const response = await fetch('http://localhost:8000/risk-map/geojson/all-risk');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Full risk data received:', data);
      
      if (data.features && data.features.length > 0) {
        console.log(`Total risk features for Government Overview:`, data.features.length);
        setRiskData(data);
      }
      
      setRiskLoading(false);
    } catch (err) {
      console.error('Error fetching risk data:', err);
      setRiskLoading(false);
    }
  };

  // Risk-based styling with color intensity proportional to risk level
  const getRiskBasedStyle = (feature) => {
    const risk = feature.properties.risk || 0;
    
    let fillColor, color;
    let opacity = 0; // No visible outlines
    let fillOpacity = 0.4; // Slightly higher opacity for government overview
    
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
      opacity: opacity,
      color: color,
      fillOpacity: fillOpacity
    };
  };

  // Popup content for each feature
  const onEachRiskFeature = (feature, layer) => {
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
        <h4>National Risk Assessment</h4>
        <p><strong>Risk Level:</strong> ${riskPercent}% (${riskLevel})</p>
        <p><strong>Assigned Partner:</strong> ${partner}</p>
        <p><strong>Team Leader:</strong> ${leader}</p>
        <p><em>Government oversight of all operational areas</em></p>
      </div>
    `);
  };

  // const fetchMap = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("http://localhost:8000/risk-map/png");
  //     const blob = await res.blob();
  //     setMapSrc(URL.createObjectURL(blob));
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to generate map");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">National Overview</h1>
          <p className="text-gray-400">High-level metrics for decision makers</p>
        </div>
        {/* <button
          //onClick={fetchMap}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Generating…" : "Generate Risk Map"}
        </button> */}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-gray-700 p-4 rounded-lg text-center"
          >
            <div className="text-sm text-gray-400">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Interactive OpenStreetMap with Risk Data */}
      <section className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Operations Area - Kharkiv Region</h2>
        <OpenStreetMap 
          partners={['A', 'B', 'C']} // Show all partners for government overview
          showLegend={true}
          title="Government Overview - All Operations"
          riskData={riskData}
          getRiskBasedStyle={getRiskBasedStyle}
          onEachRiskFeature={onEachRiskFeature}
          riskLoading={riskLoading}
        />
      </section>

      {/* Interactive Map Display */}
      {mapSrc && (
        <section className="bg-gray-800 p-6 rounded-lg">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            wheel={{ step: 0.1 }}
            doubleClick={{ disabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="mb-4 flex space-x-2">
                  <button
                    onClick={zoomIn}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                  >
                    Zoom In
                  </button>
                  <button
                    onClick={zoomOut}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                  >
                    Zoom Out
                  </button>
                  <button
                    onClick={resetTransform}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                  >
                    Reset
                  </button>
                </div>
                <TransformComponent>
                  <img
                    src={mapSrc}
                    alt="Risk Map"
                    className="block mx-auto"
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </section>
      )}
    </div>
  );
}
