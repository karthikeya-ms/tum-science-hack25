// src/pages/GovOverview.jsx
import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import SimpleMap from "./SimpleMap";

export default function GovOverview() {
  const stats = [
    { label: "Area Cleared", value: "45 000 ha" },
    { label: "Population Impacted", value: "600 000" },
    { label: "Economic Value", value: "$80 M" },
  ];

  const [mapSrc, setMapSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMap = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/risk-map/png");
      const blob = await res.blob();
      setMapSrc(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Failed to generate map");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">National Overview</h1>
          <p className="text-gray-400">High-level metrics for decision makers</p>
        </div>
        <button
          onClick={fetchMap}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Generating…" : "Generate Risk Map"}
        </button>
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

      {/* Interactive OpenStreetMap */}
      <section className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Operations Area - Kharkiv Region</h2>
        <SimpleMap />
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
