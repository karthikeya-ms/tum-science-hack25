import React from "react";
import { useTeamLead } from "../contexts/TeamLeadContext";

export default function TeamLeadAssignments() {
  const { assignments, assignFour, allSectors, partner } = useTeamLead();

  // Partner info for context
  const getPartnerInfo = () => {
    const partnerData = {
      A: { region: "Western Kharkiv", focus: "Agricultural areas" },
      B: { region: "Central Kharkiv", focus: "Urban areas" },
      C: { region: "Eastern Kharkiv", focus: "Industrial areas" }
    };
    return partnerData[partner] || partnerData.A;
  };

  const partnerInfo = getPartnerInfo();

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">Task Assignments</h1>
        <p className="text-gray-400">
          Assign Partner {partner} sectors in {partnerInfo.region} - {partnerInfo.focus}
        </p>
      </header>

      {/* Partner Sector Overview */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Partner {partner} Sectors</h2>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {allSectors.map(sector => {
            const isAssigned = assignments.some(a => a.sectors.includes(sector));
            return (
              <div
                key={sector}
                className={`p-2 text-center text-sm rounded ${
                  isAssigned 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {sector}
              </div>
            );
          })}
        </div>
        <p className="text-gray-400 text-sm">
          Available sectors: {allSectors.filter(s => !assignments.some(a => a.sectors.includes(s))).length} / {allSectors.length}
        </p>
      </div>

      {/* Team Assignments */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Team Member Assignments</h2>
        <ul className="space-y-4">
          {assignments.map((a, i) => (
            <li key={i} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="font-semibold">{a.member}</div>
                  <div className="text-gray-300 text-sm">
                    Sectors:{" "}
                    {a.sectors.length > 0
                      ? a.sectors.join(", ")
                      : "None assigned"}
                  </div>
                </div>
                {a.sectors.length < 4 && (
                  <button
                    onClick={() => assignFour(i)}
                    className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
                    disabled={allSectors.filter(s => !assignments.some(a => a.sectors.includes(s))).length < 4}
                  >
                    Assign 4 Sectors
                  </button>
                )}
              </div>
              {a.sectors.length > 0 && (
                <div>
                  <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-green-400"
                      style={{ width: `${a.progress}%` }}
                    />
                  </div>
                  <div className="text-right text-gray-300 text-sm mt-1">
                    {a.progress}% complete
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
