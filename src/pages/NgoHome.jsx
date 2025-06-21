// src/pages/NgoHome.jsx
import React from "react";

export default function NgoHome() {
  const stats = [
    { label: "Area Cleared", value: "12 350 ha" },
    { label: "Mines Found", value: "3 212" },
    { label: "Teams Active", value: "16" },
  ];

  const activity = [
    { date: "Jun 21, 2025", msg: "Team Bravo cleared Sector 5 (Donetsk)" },
    { date: "Jun 20, 2025", msg: "UXO reported in Luhansk" },
    { date: "Jun 19, 2025", msg: "Team Echo started work in Kharkiv" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Emma</h1>
        <p className="text-gray-400">Here’s your NGO overview</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-gray-700 p-4 rounded-lg text-center"
          >
            <div className="text-sm text-gray-400">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <ul className="mt-2 space-y-2">
          {activity.map((a, i) => (
            <li
              key={i}
              className="flex justify-between bg-gray-700 p-3 rounded-lg"
            >
              <span className="text-gray-400 text-sm">{a.date}</span>
              <span className="text-gray-100">{a.msg}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
