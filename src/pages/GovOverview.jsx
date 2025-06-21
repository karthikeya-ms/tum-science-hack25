// src/pages/GovOverview.jsx
import React from "react";

export default function GovOverview() {
  const stats = [
    { label: "Area Cleared", value: "45 000 ha" },
    { label: "Population Impacted", value: "600 000" },
    { label: "Economic Value", value: "$80 M" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold">National Overview</h1>
        <p className="text-gray-400">High-level metrics for decision makers</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-sm text-gray-400">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Map Placeholder */}
      <section className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Clearance Map</h2>
        <div className="w-full h-64 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-gray-500">
          [Map Placeholder]
        </div>
      </section>
    </div>
  );
}
