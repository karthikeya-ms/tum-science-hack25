// src/pages/GovOverview.jsx
import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import OpenStreetMap from "./OpenStreetMap";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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
    <div className="min-h-screen bg-[#0E1324] p-6 space-y-8 text-[#E0E6ED]">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">National Overview</h1>
          <p className="text-[#7A8FA6]">High-level metrics for decision makers</p>
        </div>
      </header>

      {/* Neon-Gauge Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s) => {
          // for radial bars we need a 0–max scale; pick a sensible max
          const domainMax = s.label === "Economic Value" ? 100 : s.value * 1.2;
          const data = [{ name: s.label, value: s.value, fill: s.color }];
          return (
            <div
              key={s.label}
              className="bg-[#1B2330] p-4 rounded-2xl shadow-md flex flex-col items-center"
            >
              <ResponsiveContainer width="100%" height={150}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="100%"
                  barSize={12}
                  data={data}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background
                    clockWise
                    dataKey="value"
                    cornerRadius={6}
                    minAngle={15}
                  />
                  <Legend
                    iconSize={0}
                    layout="vertical"
                    verticalAlign="middle"
                    align="center"
                    formatter={() => ""}
                  />
                  <Tooltip
                    wrapperStyle={{ backgroundColor: "#16202A", border: "none" }}
                    contentStyle={{ color: "#E0E6ED" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <div className="text-sm text-[#7A8FA6]">{s.label}</div>
                <div className="text-2xl font-semibold">
                  {s.value.toLocaleString()}
                  {s.unit}
                </div>
              </div>
            </div>
          );
        })}
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
    </div>
  );
}
