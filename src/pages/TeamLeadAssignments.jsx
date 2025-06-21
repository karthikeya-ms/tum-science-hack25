import React, { useState } from "react";

export default function TeamLeadAssignments() {
  // The full pool of sectors this team lead controls
  const allSectors = [
    "3A","3B","3C","3D",
    "4A","4B","4C","4D",
    "5A","5B","5C","5D"
  ];

  // Initial assignments: Alice has four; Bob & Carlos empty
  const [assignments, setAssignments] = useState([
    { member: "Alice",  sectors: ["3A","3B","3C","3D"], progress: 0 },
    { member: "Bob",    sectors: [], progress: 0 },
    { member: "Carlos", sectors: [], progress: 0 },
  ]);

  // Give operator i the next 4 unassigned sectors
  const assignFour = (i) => {
    setAssignments(prev => {
      const used = prev.flatMap(a => a.sectors);
      const next4 = allSectors.filter(s => !used.includes(s)).slice(0, 4);
      const copy = [...prev];
      copy[i] = { ...copy[i], sectors: next4, progress: 0 };
      return copy;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">Task Assignments</h1>
        <p className="text-gray-400">Assign 4 sectors per operator</p>
      </header>

      <ul className="space-y-4">
        {assignments.map((a, i) => (
          <li key={i} className="bg-gray-700 p-4 rounded-lg">
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
  );
}
