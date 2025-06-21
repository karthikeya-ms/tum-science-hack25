import React, { useState } from "react";

export default function TeamLeadHome() {
  const operators = [
    {
      name: 'Alice',
      status: 'Working on Sector 3',
      progress: 40,
      mines: 5,
      location: { lat: 49.988, lon: 36.232 },
      sectors: ['3A', '3B'],
    },
    {
      name: 'Bob',
      status: 'Idle — waiting assignment',
      progress: 0,
      mines: 0,
      location: { lat: 49.99, lon: 36.24 },
      sectors: [],
    },
    {
      name: 'Carlos',
      status: 'Reporting UXO in Sector 5',
      progress: 75,
      mines: 12,
      location: { lat: 49.995, lon: 36.22 },
      sectors: ['5A', '5B', '5C'],
    },
  ];
  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">Team Leader Overview</h1>
        <p className="text-gray-400">See your team’s real-time status</p>
      </header>

      <ul className="space-y-4">
        {operators.map((op, i) => (
          <li
            key={i}
            className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <div className="font-semibold text-lg">{op.name}</div>
              <div className="text-gray-300 text-sm">{op.status}</div>
            </div>
            <button
              onClick={() => setSelected(op)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
            >
              Stats
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-700 p-6 rounded-lg w-full max-w-md space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{selected.name} Statistics</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Progress */}
            <div>
              <div className="text-sm text-gray-400">Progress</div>
              <div className="w-full bg-gray-600 h-3 rounded-full overflow-hidden mt-1">
                <div
                  className="h-3 bg-green-400"
                  style={{ width: `${selected.progress}%` }}
                />
              </div>
              <div className="text-right text-gray-300 text-sm mt-1">
                {selected.progress}%
              </div>
            </div>

            {/* Mines Discovered */}
            <div>
              <div className="text-sm text-gray-400">Mines Discovered</div>
              <div className="text-xl font-medium">{selected.mines}</div>
            </div>

            {/* Live Location & Sectors */}
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Live Location</div>
              <div className="w-full h-40 bg-gray-800 relative rounded">
                {/* Placeholder map with red dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                </div>
              </div>
              <div className="text-sm text-gray-400">Assigned Sectors</div>
              <div className="text-gray-200">
                {selected.sectors.length > 0
                  ? selected.sectors.join(', ')
                  : 'None'}
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
