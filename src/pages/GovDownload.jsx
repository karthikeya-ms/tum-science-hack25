// src/pages/GovDownload.jsx

import React, { useState } from "react";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function GovDownload() {
  const [availablePartners] = useState(["A", "B", "C"]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [generating, setGenerating] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#0E1324] p-6 text-[#E0E6ED] space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Data & Reports Download</h1>
        <p className="text-[#7A8FA6]">
          Export raw data, maps, and summary reports
        </p>
      </header>

      {/* Partner Selector */}
      <div className="flex items-center space-x-3">
        <label className="text-[#7A8FA6]">Filter by NGO:</label>
        <select
          value={selectedPartner}
          onChange={(e) => setSelectedPartner(e.target.value)}
          className="bg-[#1B2330] text-[#E0E6ED] px-3 py-2 rounded-lg"
        >
          <option value="">All</option>
          {availablePartners.map((p) => (
            <option key={p} value={p}>
              Partner {p}
            </option>
          ))}
        </select>
      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* PNG */}
        <a
          href={downloadUrl("png", selectedPartner)}
          target="_blank"
          rel="noopener"
          className="flex items-center justify-center space-x-2 bg-[#1B2330] hover:bg-[#27304a] p-4 rounded-xl shadow-md"
        >
          <ArrowDownTrayIcon className="w-6 h-6 text-[#00d8c3]" />
          <span>Download Map (PNG)</span>
        </a>

        {/* GeoJSON */}
        <a
          href={downloadUrl("geojson", selectedPartner)}
          target="_blank"
          rel="noopener"
          className="flex items-center justify-center space-x-2 bg-[#1B2330] hover:bg-[#27304a] p-4 rounded-xl shadow-md"
        >
          <ArrowDownTrayIcon className="w-6 h-6 text-[#FFD93D]" />
          <span>Download Data (GeoJSON)</span>
        </a>

        {/* CSV (stub) */}
        <button
          onClick={() => alert("CSV export coming soon")}
          className="flex items-center justify-center space-x-2 bg-[#1B2330] hover:bg-[#27304a] p-4 rounded-xl shadow-md"
        >
          <DocumentTextIcon className="w-6 h-6 text-[#FF6B6B]" />
          <span>Download Data (CSV)</span>
        </button>

        {/* PDF Summary */}
        <button
          onClick={handleGeneratePDF}
          disabled={generating}
          className={`flex items-center justify-center space-x-2 p-4 rounded-xl shadow-md ${
            generating
              ? "bg-gray-600 text-gray-400 cursor-wait"
              : "bg-[#00d8c3] hover:bg-[#20e4cd] text-[#0E1324]"
          }`}
        >
          <DocumentTextIcon
            className={`w-6 h-6 ${generating ? "animate-spin" : ""}`}
          />
          <span>{generating ? "Generating…" : "Download PDF Report"}</span>
        </button>
      </div>

      {/* Notes */}
      <p className="text-sm text-[#7A8FA6]">
        You can download full or partner-specific data. CSV export will be
        available soon.
      </p>
    </div>
  );
}
