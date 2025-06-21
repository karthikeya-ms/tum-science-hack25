// src/pages/NgoHome.jsx

import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, NGO Partner {partner}
          </h1>
          <p className="text-gray-400">
            Here’s the map allocated to you
          </p>
        </div>
        <button
          onClick={fetchMap}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Loading…" : "Reload My Map"}
        </button>
      </header>

      {/* If we have mapSrc, render it zoomable */}
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
                    alt={`Risk Map for Partner ${partner}`}
                    className="block mx-auto"
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </section>
      )}

      {/* Fallback if no map yet */}
      {!mapSrc && !loading && (
        <div className="text-center text-gray-500">
          Click “Reload My Map” to load your allocated region.
        </div>
      )}
    </div>
  );
}
