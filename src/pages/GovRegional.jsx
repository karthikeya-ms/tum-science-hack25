// src/pages/GovRegional.jsx
import React from "react";

export default function GovRegional() {
  const regions = [
    { region: "Donetsk", cleared: "12 000 ha", incidents: 128, teams: 6 },
    { region: "Luhansk", cleared: "8 500 ha", incidents: 72, teams: 4 },
    { region: "Kharkiv", cleared: "6 000 ha", incidents: 56, teams: 3 },
    { region: "Kyiv",   cleared: "5 000 ha", incidents: 34, teams: 2 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold">Regional Progress</h1>
        <p className="text-gray-400">Breakdown by oblast/region</p>
      </header>

      {/* Table */}
      <div className="bg-gray-700 rounded-lg overflow-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-gray-400">Region</th>
              <th className="px-4 py-2 text-gray-400">Area Cleared</th>
              <th className="px-4 py-2 text-gray-400">Incidents</th>
              <th className="px-4 py-2 text-gray-400">Teams Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {regions.map((r, i) => (
              <tr key={i}>
                <td className="px-4 py-3">{r.region}</td>
                <td className="px-4 py-3">{r.cleared}</td>
                <td className="px-4 py-3">{r.incidents}</td>
                <td className="px-4 py-3">{r.teams}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
