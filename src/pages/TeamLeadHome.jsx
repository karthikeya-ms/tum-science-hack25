import React from "react";

export default function TeamLeadHome() {
  const team = [
    { name: "Alice", status: "Working on Sector 3" },
    { name: "Bob", status: "Idle — waiting assignment" },
    { name: "Carlos", status: "Reporting UXO in Sector 5" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">Team Leader Overview</h1>
        <p className="text-gray-400">See your team’s real-time status</p>
      </header>

      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Team Status</h2>
        <ul className="space-y-3">
          {team.map((m, i) => (
            <li key={i} className="flex justify-between p-4 bg-gray-800 rounded">
              <span>{m.name}</span>
              <span className="text-gray-300">{m.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
