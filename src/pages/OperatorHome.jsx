import React from "react";
import OpenStreetMap from "./OpenStreetMap";

export default function OperatorHome() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold">Operator Overview</h1>
        <p className="text-gray-400">Your assigned sector and risk map</p>
      </header>

      {/* Sector Info & Map Placeholder */}
      <section className="bg-gray-700 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="text-sm text-gray-400">Assigned Sector</div>
            <div className="text-xl font-semibold">Sector 12 (Donetsk)</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Current Risk Level</div>
            <div className="text-xl font-semibold text-yellow-300">Moderate</div>
          </div>
        </div>
        <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
          <OpenStreetMap />
        </div>
      </section>
    </div>
  );
}
