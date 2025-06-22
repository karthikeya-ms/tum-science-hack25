// src/pages/GovDownload.jsx

import React, { useState } from "react";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function GovDownload() {
  const [availablePartners] = useState(["A", "B", "C"]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [generating, setGenerating] = useState(false);
  const [mapSrc, setMapSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("png");

  const downloadUrl = (type, partner) => {
    const base = "http://localhost:8000";
    if (type === "png") {
      return partner
        ? `${base}/risk-map/png?partner=${partner}`
        : `${base}/risk-map/png`;
    }
    if (type === "geojson") {
      return partner
        ? `${base}/risk-map/geojson?partner=${partner}`
        : `${base}/risk-map/geojson`;
    }
    return "#";
  };

  const handleGeneratePDF = async () => {
    setGenerating(true);
    // TODO: replace with real PDF-generation call
    await new Promise((r) => setTimeout(r, 1500));
    window.open("/reports/summary.pdf", "_blank");
    setGenerating(false);
  };

  const fetchMap = async (fmt) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/risk-map/${fmt}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      if (fmt === "png") {
        const blob = await res.blob();
        setMapSrc(URL.createObjectURL(blob));
      } else {
        // For other formats, trigger download
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `risk-map.${fmt}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to generate ${fmt.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-white">Download Center</h1>
          <p className="text-teal-300">Export maps and data in various formats</p>
        </header>

        {/* Export Options */}
        <section className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Export Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => {
                setFormat("png");
                fetchMap("png");
              }}
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-lg transition"
            >
              {loading && format === "png" ? "Generating..." : "Download PNG"}
            </button>
            
            <button
              onClick={() => {
                setFormat("pdf");
                fetchMap("pdf");
              }}
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-lg transition"
            >
              {loading && format === "pdf" ? "Generating..." : "Download PDF"}
            </button>
            
            <button
              onClick={() => {
                setFormat("geojson");
                fetchMap("geojson");
              }}
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-lg transition"
            >
              {loading && format === "geojson" ? "Generating..." : "Download GeoJSON"}
            </button>
          </div>

          {/* Format Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-white mb-2">PNG Image</h3>
              <p className="text-gray-300 text-sm">
                High-quality raster image suitable for presentations and reports.
                Includes legend and styling.
              </p>
            </div>
            
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-white mb-2">PDF Document</h3>
              <p className="text-gray-300 text-sm">
                Professional document format with embedded map and metadata.
                Perfect for official reports.
              </p>
            </div>
            
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <h3 className="font-semibold text-white mb-2">GeoJSON Data</h3>
              <p className="text-gray-300 text-sm">
                Raw geospatial data format compatible with GIS software.
                Includes all risk and partner information.
              </p>
            </div>
          </div>
        </section>

        {/* Preview */}
        {mapSrc && (
          <section className="bg-[#1f2a36] bg-opacity-90 p-6 rounded-2xl shadow-xl border border-teal-500/20">
            <h2 className="text-xl font-semibold mb-4 text-white">Preview</h2>
            <div className="bg-[#27323e] p-4 rounded-xl border border-teal-500/10">
              <TransformWrapper>
                <TransformComponent>
                  <img
                    src={mapSrc}
                    alt="Risk Map"
                    className="w-full h-auto rounded-lg"
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
