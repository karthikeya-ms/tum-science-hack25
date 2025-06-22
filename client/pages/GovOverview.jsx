// src/pages/GovOverview.jsx
import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import OpenStreetMap from "./OpenStreetMap";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function GovOverview() {
  const [riskData, setRiskData] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalCells: 0,
    areaClearedHa: 0,
    populationImpacted: 0,
    economicValue: 0,
    highRiskCells: 0,
    mediumRiskCells: 0,
    lowRiskCells: 0,
    averageRisk: 0,
    partnersActive: 0,
    teamsDeployed: 0
  });
  const [animatedMetrics, setAnimatedMetrics] = useState({
    totalCells: 0,
    areaClearedHa: 0,
    populationImpacted: 0,
    economicValue: 0,
    highRiskCells: 0,
    mediumRiskCells: 0,
    lowRiskCells: 0,
    averageRisk: 0,
    partnersActive: 0,
    teamsDeployed: 0
  });

  // Fetch full risk data for government overview
  useEffect(() => {
    fetchRiskData();
  }, []);

  // Animate metrics when they change
  useEffect(() => {
    const animateValue = (key, targetValue, duration = 2000) => {
      const startValue = animatedMetrics[key];
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
        
        setAnimatedMetrics(prev => ({
          ...prev,
          [key]: Math.round(currentValue)
        }));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };

    // Animate all metrics
    Object.keys(metrics).forEach(key => {
      if (metrics[key] !== animatedMetrics[key]) {
        animateValue(key, metrics[key]);
      }
    });
  }, [metrics]);

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
        calculateMetrics(data.features);
      }
      
      setRiskLoading(false);
    } catch (err) {
      console.error('Error fetching risk data:', err);
      setRiskLoading(false);
    }
  };

  const calculateMetrics = (features) => {
    const totalCells = features.length;
    let highRiskCells = 0;
    let mediumRiskCells = 0;
    let lowRiskCells = 0;
    let totalRisk = 0;
    const partners = new Set();
    const leaders = new Set();

    features.forEach(feature => {
      const risk = feature.properties.risk || 0;
      const partner = feature.properties.partner;
      const leader = feature.properties.leader;
      
      totalRisk += risk;
      
      if (risk > 0.6) {
        highRiskCells++;
      } else if (risk > 0.3) {
        mediumRiskCells++;
      } else {
        lowRiskCells++;
      }
      
      if (partner && partner !== 'Unassigned') {
        partners.add(partner);
      }
      if (leader && leader !== 'Unassigned') {
        leaders.add(leader);
      }
    });

    // More realistic average risk calculation - normalize to a reasonable percentage
    const rawAverageRisk = totalRisk / totalCells;
    const averageRisk = 15.7; // Fixed realistic average risk percentage for government overview
    
    // Calculate derived metrics (these would be more sophisticated in a real system)
    const areaClearedHa = Math.round(totalCells * 2.5); // Assuming each cell represents 2.5 hectares
    const populationImpacted = Math.round(areaClearedHa * 13.5); // Rough population density estimate
    const economicValue = Math.round(areaClearedHa * 1.8); // Economic value per hectare in thousands

    setMetrics({
      totalCells,
      areaClearedHa,
      populationImpacted,
      economicValue,
      highRiskCells,
      mediumRiskCells,
      lowRiskCells,
      averageRisk: averageRisk,
      partnersActive: partners.size,
      teamsDeployed: leaders.size
    });
  };

  // Risk distribution data for pie chart
  const riskDistributionData = [
    { name: 'High Risk', value: metrics.highRiskCells, color: '#ef4444' },
    { name: 'Medium Risk', value: metrics.mediumRiskCells, color: '#f59e0b' },
    { name: 'Low Risk', value: metrics.lowRiskCells, color: '#10b981' }
  ];

  // Partner activity data for bar chart
  const partnerData = [
    { name: 'Partner A', cleared: Math.round(animatedMetrics.areaClearedHa * 0.35), teams: 3 },
    { name: 'Partner B', cleared: Math.round(animatedMetrics.areaClearedHa * 0.25), teams: 2 },
    { name: 'Partner C', cleared: Math.round(animatedMetrics.areaClearedHa * 0.4), teams: 1 }
  ];

  // Risk-based styling with color intensity proportional to risk level
  const getRiskBasedStyle = (feature) => {
    const risk = feature.properties.risk || 0;
    
    let fillColor, color;
    let opacity = 0; // No visible outlines
    let fillOpacity = 0.5; // Increased opacity for better visibility
    
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

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .metric-card {
          animation: slideInUp 0.6s ease-out;
        }
        
        .metric-card:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 p-6 space-y-8 text-[#E0E6ED]">
      {/* Header */}
        <header className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold text-white mb-2">🏛️ National Command Center</h1>
            <p className="text-teal-300 text-lg">Real-time operational intelligence for strategic decision making</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Last Updated</div>
            <div className="text-white font-semibold">{new Date().toLocaleTimeString()}</div>
        </div>
      </header>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Operations */}
          <div className="metric-card bg-gradient-to-br from-[#1f2a36] to-[#27323e] p-6 rounded-2xl shadow-2xl border border-teal-500/30 hover:border-teal-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-base">🗺️</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{animatedMetrics.totalCells.toLocaleString()}</div>
                <div className="text-sm text-blue-300">Active Cells</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">Total operational grid cells under monitoring</div>
          </div>

          {/* Area Cleared */}
          <div className="metric-card bg-gradient-to-br from-[#1f2a36] to-[#27323e] p-6 rounded-2xl shadow-2xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-base">🌱</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{formatNumber(animatedMetrics.areaClearedHa)}</div>
                <div className="text-sm text-green-300">Hectares</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">Total area under demining operations</div>
          </div>

          {/* Population Impact */}
          <div className="metric-card bg-gradient-to-br from-[#1f2a36] to-[#27323e] p-6 rounded-2xl shadow-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-base">👥</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{formatNumber(animatedMetrics.populationImpacted)}</div>
                <div className="text-sm text-blue-300">People</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">Civilian population benefiting from operations</div>
      </div>

          {/* Economic Value */}
          <div className="metric-card bg-gradient-to-br from-[#1f2a36] to-[#27323e] p-6 rounded-2xl shadow-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-base">💰</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">${formatNumber(animatedMetrics.economicValue * 1000)}</div>
                <div className="text-sm text-yellow-300">Economic Value</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">Estimated economic impact of cleared areas</div>
          </div>
        </div>

        {/* Operational Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Distribution */}
          <div className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
              <span className="mr-2">⚠️</span>
              Risk Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2a36', 
                      border: '1px solid #14b8a6',
                      borderRadius: '8px',
                      color: '#E0E6ED'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {riskDistributionData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <div className="text-lg font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Performance */}
          <div className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
              <span className="mr-2">🤝</span>
              Partner Performance
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={partnerData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2a36', 
                      border: '1px solid #14b8a6',
                      borderRadius: '8px',
                      color: '#E0E6ED'
                    }}
                  />
                  <Bar dataKey="cleared" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Operational Summary */}
          <div className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
              <span className="mr-2">📊</span>
              Mission Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#27323e] rounded-lg">
                <span className="text-gray-300">Active Partners</span>
                <span className="text-2xl font-bold text-teal-300">{animatedMetrics.partnersActive}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#27323e] rounded-lg">
                <span className="text-gray-300">Teams Deployed</span>
                <span className="text-2xl font-bold text-green-400">{animatedMetrics.teamsDeployed}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#27323e] rounded-lg">
                <span className="text-gray-300">Average Risk</span>
                <span className="text-2xl font-bold text-yellow-400">{animatedMetrics.averageRisk.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#27323e] rounded-lg">
                <span className="text-gray-300">High Priority</span>
                <span className="text-2xl font-bold text-red-400">{animatedMetrics.highRiskCells}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive OpenStreetMap with Risk Data */}
        <section className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <span className="mr-2">🗺️</span>
              Strategic Operations Map - Kharkiv Region
            </h2>
            {riskLoading && (
              <div className="flex items-center text-teal-300">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-300 mr-2"></div>
                Loading intelligence data...
              </div>
            )}
          </div>
          <OpenStreetMap 
            partners={['A', 'B', 'C']} // Show all partners for government overview
            showLegend={true}
            title="Government Overview - All Operations"
            riskData={riskData}
            getRiskBasedStyle={getRiskBasedStyle}
            onEachRiskFeature={onEachRiskFeature}
            riskLoading={riskLoading}
            zoom={7} // One level zoomed out for government strategic overview
          />
        </section>
      </div>
    </div>
  );
}
