// src/pages/NgoHome.jsx

import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import OpenStreetMap from "./OpenStreetMap";

export default function NgoHome({ partner }) {
  const [mapSrc, setMapSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);

  // Define which leaders belong to which partners
  const partnerLeaders = {
    'A': ['A1', 'A2', 'A3'],
    'B': ['B1', 'B2'],
    'C': ['C1']
  };

  // Whenever our partner code changes (on login), fetch their map and risk data
  useEffect(() => {
    if (partner) {
      fetchMap();
      fetchRiskData();
    }
  }, [partner]);

  const fetchMap = async () => {
    setLoading(true);
    try {
      // Pass partner query param
      const url = `http://localhost:8000/risk-map/png?partner=${partner}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      setMapSrc(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiskData = async () => {
    try {
      console.log(`Fetching risk data for Partner ${partner}...`);
      setRiskLoading(true);
      
      const response = await fetch('http://localhost:8000/risk-map/geojson/all-risk');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Risk data received:', data);
      
      if (data.features && data.features.length > 0) {
        // Filter to show only cells assigned to this partner's leaders
        const partnerLeadersList = partnerLeaders[partner] || [];
        const partnerFeatures = data.features.filter(feature => 
          partnerLeadersList.includes(feature.properties.leader)
        );
        
        console.log(`Filtered features for Partner ${partner} leaders (${partnerLeadersList.join(', ')}):`, partnerFeatures.length);
        
        const partnerRiskData = {
          ...data,
          features: partnerFeatures
        };
        
        setRiskData(partnerRiskData);
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
    let opacity = 0;
    let fillOpacity = 0.45;
    
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
    const partnerProp = feature.properties.partner || 'Unassigned';
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
        <h4>Partner ${partner} Risk Assessment</h4>
        <p><strong>Risk Level:</strong> ${riskPercent}% (${riskLevel})</p>
        <p><strong>Partner:</strong> ${partnerProp}</p>
        <p><strong>Team Leader:</strong> ${leader}</p>
        <p><em>Color intensity reflects mine risk level</em></p>
      </div>
    `);
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
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome, NGO Partner {partner}
            </h1>
            <p className="text-teal-300">
              Here's your assigned operational region
            </p>
          </div>
        </header>

        {/* Interactive Map Section */}
        <section className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Partner {partner} Operational Area
          </h2>
          <div className="h-96">
            <OpenStreetMap 
              partners={[partner]} 
              showLegend={false}
              title={`Partner ${partner} Operations`}
              filterLeadersByPartner={partner}
              riskData={riskData}
              getRiskBasedStyle={getRiskBasedStyle}
              onEachRiskFeature={onEachRiskFeature}
              riskLoading={riskLoading}
            />
          </div>
        </section>

        {/* Partner-specific information section */}
        <section className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Partner {partner} Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-lg mb-2 text-white">Your Assignment</h3>
              <p className="text-gray-300 mb-6">
                {partner === 'A' && "You are responsible for the central sector of the Kharkiv region. Focus on urban areas and transportation corridors."}
                {partner === 'B' && "You are responsible for the eastern sector of the Kharkiv region. Focus on industrial areas and border regions."}
                {partner === 'C' && "You are responsible for the western sector of the Kharkiv region. Focus on agricultural areas and rural settlements."}
              </p>
            </div>
            
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-lg mb-2 text-white">Risk Profile</h3>
              <p className="text-gray-300">
                {partner === 'A' && "Moderate risk areas with scattered contamination. Priority: Clear agricultural land for farming resumption."}
                {partner === 'B' && "High-density contamination in urban areas. Priority: Critical infrastructure and civilian safety."}
                {partner === 'C' && "Variable risk with potential heavy contamination near former conflict zones. Priority: Border security and industrial sites."}
              </p>
            </div>
            
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-lg mb-2 text-white">Team Leaders</h3>
              <p className="text-gray-300">
                {partner === 'A' && "Your team leaders A1, A2, and A3 are managing field operations across your assigned sectors."}
                {partner === 'B' && "Your team leaders B1 and B2 are coordinating urban demining operations in critical areas."}
                {partner === 'C' && "Your team leader C1 is overseeing border and industrial area clearance operations."}
              </p>
            </div>
            
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-lg mb-2 text-white">Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                <span className="text-teal-400">Operational</span>
              </div>
              <p className="text-gray-300 text-sm mt-1">
                All systems active. Risk data updated in real-time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
