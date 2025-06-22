// src/pages/GovRegional.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend as PieLegend,
  Tooltip as PieTooltip,
} from "recharts";
import OpenStreetMap from "./OpenStreetMap";

export default function GovRegional() {
  const [selectedPartner, setSelectedPartner] = useState("");
  const [availablePartners] = useState(["A", "B", "C"]);
  const [riskData, setRiskData] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);

  const data = [
    { region: "Donetsk", cleared: 12000, incidents: 128, teams: 6 },
    { region: "Luhansk", cleared:  8500, incidents:  72, teams: 4 },
    { region: "Kharkiv", cleared:  6000, incidents:  56, teams: 3 },
    { region: "Kyiv",    cleared:  5000, incidents:  34, teams: 2 },
  ];

  // Compute totals
  const totals = data.reduce(
    (acc, r) => {
      acc.cleared += r.cleared;
      acc.incidents += r.incidents;
      acc.teams += r.teams;
      return acc;
    },
    { cleared: 0, incidents: 0, teams: 0 }
  );

  const COLORS = ["#00d8c3", "#FF6B6B", "#FFD93D", "#5F27CD"];

  // Fetch risk data
  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    try {
      console.log('Fetching risk data for Regional Analysis...');
      setRiskLoading(true);
      
      const response = await fetch('http://localhost:8000/risk-map/geojson/all-risk');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Risk data received:', data);
      
      if (data.features && data.features.length > 0) {
        setRiskData(data);
      }
      
      setRiskLoading(false);
    } catch (err) {
      console.error('Error fetching risk data:', err);
      setRiskLoading(false);
    }
  };

  // Get filtered statistics based on selected partner
  const getFilteredStats = () => {
    if (!riskData || !selectedPartner) {
      return { totalAreas: 0, avgRisk: 0, lowRisk: 0, mediumRisk: 0, highRisk: 0 };
    }

    // Define which leaders belong to which partners
    const partnerLeaders = {
      'A': ['A1', 'A2', 'A3'],
      'B': ['B1', 'B2'],
      'C': ['C1']
    };

    const partnerLeadersList = partnerLeaders[selectedPartner] || [];
    const partnerFeatures = riskData.features.filter(feature => 
      partnerLeadersList.includes(feature.properties.leader)
    );

    const risks = partnerFeatures.map(f => f.properties.risk || 0);
    const totalAreas = risks.length;
    const avgRisk = totalAreas > 0 ? risks.reduce((a, b) => a + b, 0) / totalAreas : 0;
    
    const lowRisk = risks.filter(r => r <= 0.3).length;
    const mediumRisk = risks.filter(r => r > 0.3 && r <= 0.6).length;
    const highRisk = risks.filter(r => r > 0.6).length;

    return { totalAreas, avgRisk, lowRisk, mediumRisk, highRisk };
  };

  // Risk-based styling
  const getRiskBasedStyle = (feature) => {
    const risk = feature.properties.risk || 0;
    
    let fillColor, color;
    let opacity = 0;
    let fillOpacity = 0.5;
    
    if (risk <= 0.3) {
      const intensity = risk / 0.3;
      const greenValue = Math.floor(128 + (127 * intensity));
      fillColor = `rgb(0, ${greenValue}, 0)`;
      color = `rgb(0, ${Math.floor(greenValue * 0.7)}, 0)`;
    } else if (risk <= 0.6) {
      const intensity = (risk - 0.3) / 0.3;
      const redValue = Math.floor(200 + (55 * intensity));
      const greenValue = Math.floor(255 - (100 * intensity));
      fillColor = `rgb(${redValue}, ${greenValue}, 0)`;
      color = `rgb(${Math.floor(redValue * 0.8)}, ${Math.floor(greenValue * 0.8)}, 0)`;
    } else {
      const intensity = Math.min((risk - 0.6) / 0.4, 1);
      const redValue = Math.floor(180 + (75 * intensity));
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
        <h4>Regional Risk Assessment</h4>
        <p><strong>Risk Level:</strong> ${riskPercent}% (${riskLevel})</p>
        <p><strong>Partner:</strong> ${partner}</p>
        <p><strong>Team Leader:</strong> ${leader}</p>
        <p><em>Regional analysis view</em></p>
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
      <div className="relative z-10 p-6 space-y-8 text-white">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-white">Regional Analysis</h1>
          <p className="text-teal-300">Detailed breakdown by operational sectors</p>
        </header>

        {/* Partner Filter */}
        <div className="bg-[#1f2a36] bg-opacity-90 p-4 rounded-2xl shadow-xl border border-teal-500/20">
          <label className="text-teal-300 font-medium">Filter by Partner:</label>
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            className="ml-3 bg-[#27323e] text-white px-3 py-2 rounded-lg border border-teal-500/20"
          >
            <option value="">All Partners</option>
            {availablePartners.map((p) => (
              <option key={p} value={p}>
                Partner {p}
              </option>
            ))}
          </select>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
            <h3 className="text-lg font-semibold text-white mb-2">Total Areas</h3>
            <div className="text-3xl font-bold text-teal-400">
              {selectedPartner ? getFilteredStats().totalAreas : "1,247"}
            </div>
            <p className="text-gray-300 text-sm">Operational grid cells</p>
          </div>
          
          <div className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
            <h3 className="text-lg font-semibold text-white mb-2">Average Risk</h3>
            <div className="text-3xl font-bold text-green-400">
              {selectedPartner ? `${(getFilteredStats().avgRisk * 100).toFixed(1)}%` : "42.3%"}
            </div>
            <p className="text-gray-300 text-sm">Risk assessment level</p>
          </div>
          
          <div className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
            <h3 className="text-lg font-semibold text-white mb-2">Active Partners</h3>
            <div className="text-3xl font-bold text-teal-400">
              {selectedPartner ? "1" : "3"}
            </div>
            <p className="text-gray-300 text-sm">NGO organizations</p>
          </div>
        </div>

        {/* Interactive Map */}
        <section className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {selectedPartner ? `Partner ${selectedPartner} ` : ""}Regional Map
          </h2>
          <div className="h-96">
            <OpenStreetMap 
              partners={selectedPartner ? [selectedPartner] : ['A', 'B', 'C']}
              showLegend={!selectedPartner}
              title={selectedPartner ? `Partner ${selectedPartner} Regional View` : "All Partners Regional View"}
              riskData={riskData}
              getRiskBasedStyle={getRiskBasedStyle}
              onEachRiskFeature={onEachRiskFeature}
              riskLoading={riskLoading}
            />
          </div>
        </section>

        {/* Risk Distribution */}
        <section className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Risk Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                <span className="text-white font-medium">Low Risk (0-30%)</span>
              </div>
              <div className="text-2xl font-bold text-green-400 mt-2">
                {selectedPartner ? getFilteredStats().lowRisk : "523"}
              </div>
              <p className="text-gray-300 text-sm">areas identified</p>
            </div>
            
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                <span className="text-white font-medium">Medium Risk (30-60%)</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400 mt-2">
                {selectedPartner ? getFilteredStats().mediumRisk : "461"}
              </div>
              <p className="text-gray-300 text-sm">areas identified</p>
            </div>
            
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                <span className="text-white font-medium">High Risk (60-100%)</span>
              </div>
              <div className="text-2xl font-bold text-red-400 mt-2">
                {selectedPartner ? getFilteredStats().highRisk : "263"}
              </div>
              <p className="text-gray-300 text-sm">areas identified</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

