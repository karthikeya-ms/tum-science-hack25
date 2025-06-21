// src/pages/NgoOperations.jsx
import React from "react";

export default function NgoOperations() {
  const operations = [
    { name: "Donetsk Sector 5", region: "Donetsk", team: "Bravo", status: "In Progress", progress: 70 },
    { name: "Luhansk Sector 2", region: "Luhansk", team: "Delta", status: "Cleared", progress: 100 },
    { name: "Kharkiv Sector 1", region: "Kharkiv", team: "Echo", status: "In Progress", progress: 35 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-white">Operations</h1>
        <p className="text-gray-400">Manage and review all clearance operations</p>
      </header>

      {/* Operations List */}
      <ul className="space-y-4">
        {operations.map((op, i) => (
          <li
            key={i}
            className="bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">{op.name}</h2>
              <p className="text-gray-400 text-sm">
                {op.region} • Team {op.team}
              </p>
            </div>
            <div className="w-full sm:w-1/3 mt-3 sm:mt-0">
              <div className="w-full bg-gray-600 h-3 rounded-full overflow-hidden">
                <div
                  className="h-3 rounded-full bg-blue-400"
                  style={{ width: `${op.progress}%` }}
                />
              </div>
              <p className="text-gray-200 text-sm mt-1">
                {op.status} ({op.progress}%)
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
