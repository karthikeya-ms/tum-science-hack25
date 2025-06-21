import React, { useState } from "react";
import { useTeamLead } from "../contexts/TeamLeadContext";

export default function TeamLeadHome() {
  const { assignments, partner } = useTeamLead();
  const [selected, setSelected] = useState(null);

  // Partner-specific information
  const getPartnerInfo = () => {
    const partnerData = {
      A: {
        region: "Western Kharkiv",
        focus: "Agricultural areas and rural settlements",
        riskLevel: "Moderate",
        priority: "Clear agricultural land for farming resumption"
      },
      B: {
        region: "Central Kharkiv", 
        focus: "Urban areas and transportation corridors",
        riskLevel: "High",
        priority: "Critical infrastructure and civilian safety"
      },
      C: {
        region: "Eastern Kharkiv",
        focus: "Industrial areas and border regions", 
        riskLevel: "Variable to High",
        priority: "Border security and industrial sites"
      }
    };
    return partnerData[partner] || partnerData.A;
  };

  const partnerInfo = getPartnerInfo();

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">Team Leader Overview</h1>
        <p className="text-gray-400">
          Managing Partner {partner} operations in {partnerInfo.region}
        </p>
      </header>

      {/* Partner Assignment Info */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Partner {partner} Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Operational Region</h3>
            <p className="text-gray-300">{partnerInfo.region}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Focus Areas</h3>
            <p className="text-gray-300">{partnerInfo.focus}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Risk Level</h3>
            <p className="text-gray-300">{partnerInfo.riskLevel}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Priority Mission</h3>
            <p className="text-gray-300">{partnerInfo.priority}</p>
          </div>
        </div>
      </div>

      {/* Team Status */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Team Status</h2>
        <ul className="space-y-4">
          {assignments.map((op, i) => (
            <li
              key={i}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-semibold text-lg">{op.member}</div>
                <div className="text-gray-300 text-sm">
                  {op.sectors.length > 0 
                    ? `Working on ${op.sectors.length} sectors: ${op.sectors.slice(0, 3).join(", ")}${op.sectors.length > 3 ? "..." : ""}`
                    : "Idle — waiting assignment"
                  }
                </div>
                {op.sectors.length > 0 && (
                  <div className="text-gray-400 text-xs mt-1">
                    Progress: {op.progress}% • Mines found: {op.mines}
                  </div>
                )}
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
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-700 p-6 rounded-lg w-full max-w-md space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{selected.member} Statistics</h2>
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
