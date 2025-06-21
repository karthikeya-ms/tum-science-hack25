import React, { useState } from "react";

export default function TeamLeadAssignments() {
  const [assignments, setAssignments] = useState([
    { member: "Alice", sector: "Sector 3", progress: 40 },
    { member: "Bob", sector: "—", progress: 0 },
    { member: "Carlos", sector: "Sector 5", progress: 75 },
  ]);

  const reassign = (idx) => {
    const sector = prompt("Enter new sector for " + assignments[idx].member);
    if (!sector) return;
    const updated = assignments.slice();
    updated[idx] = { ...updated[idx], sector, progress: 0 };
    setAssignments(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">Task Assignments</h1>
        <p className="text-gray-400">Assign sectors & track progress</p>
      </header>

      <ul className="space-y-4">
        {assignments.map((a, i) => (
          <li key={i} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{a.member}</div>
                <div className="text-gray-300 text-sm">Sector: {a.sector || "None"}</div>
              </div>
              <button
                onClick={() => reassign(i)}
                className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
              >
                Reassign
              </button>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
                <div className="h-2 bg-green-400" style={{ width: `${a.progress}%` }} />
              </div>
              <div className="text-right text-gray-300 text-sm mt-1">
                {a.progress}% complete
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
