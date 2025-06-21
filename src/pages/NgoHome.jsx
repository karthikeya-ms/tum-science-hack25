// src/pages/NgoHome.jsx

import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import OpenStreetMap from "./OpenStreetMap";

export default function NgoHome({ partner }) {
  const [mapSrc, setMapSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  // Whenever our partner code changes (on login), fetch their map
  useEffect(() => {
    if (partner) {
      fetchMap();
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
      alert("Failed to load your map slice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-white">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, NGO Partner {partner}
          </h1>
          <p className="text-gray-400">
            Here's your assigned operational region
          </p>
        </div>
      </header>

      {/* Interactive Map Section */}
      <section className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Partner {partner} Operational Area
        </h2>
        <div className="h-96">
          <OpenStreetMap 
            partners={[partner]} 
            showLegend={false}
            title={`Partner ${partner} Operations`}
          />
        </div>
      </section>

      {/* Legacy PNG Map Section (Optional - for comparison) */}
      {/* {mapSrc && (
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Legacy Map View (PNG)
          </h2>
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
                  <button
                    onClick={fetchMap}
                    disabled={loading}
                    className={`px-4 py-2 rounded ${
                      loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"
                    }`}
                  >
                    {loading ? "Loading…" : "Reload PNG Map"}
                  </button>
                </div>
                <TransformComponent>
                  <img
                    src={mapSrc}
                    alt={`Risk Map for Partner ${partner}`}
                    className="block mx-auto"
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </section>
      )} */}

      {/* Partner-specific information section */}
      <section className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Partner {partner} Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Your Assignment</h3>
            <p className="text-gray-300">
              {partner === 'A' && "You are responsible for the western sector of the Kharkiv region. Focus on agricultural areas and rural settlements."}
              {partner === 'B' && "You are responsible for the central sector of the Kharkiv region. Focus on urban areas and transportation corridors."}
              {partner === 'C' && "You are responsible for the eastern sector of the Kharkiv region. Focus on industrial areas and border regions."}
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Risk Profile</h3>
            <p className="text-gray-300">
              {partner === 'A' && "Moderate risk areas with scattered contamination. Priority: Clear agricultural land for farming resumption."}
              {partner === 'B' && "High-density contamination in urban areas. Priority: Critical infrastructure and civilian safety."}
              {partner === 'C' && "Variable risk with potential heavy contamination near former conflict zones. Priority: Border security and industrial sites."}
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Coordination</h3>
            <p className="text-gray-300">
              Work closely with local authorities and coordinate with Partners {partner === 'A' ? 'B & C' : partner === 'B' ? 'A & C' : 'A & B'} for boundary areas and shared resources.
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400">Operational</span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              All systems active. Data updated in real-time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
