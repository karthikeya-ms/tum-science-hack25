// src/pages/NgoReports.jsx
import React, { useState } from "react";

export default function NgoReports() {
  const [reports, setReports] = useState([
    { id: 1, date: "Jun 15, 2025 10:30", url: "#" },
    { id: 2, date: "Jun 01, 2025 14:45", url: "#" },
    { id: 2, date: "May 15, 2025 14:45", url: "#" },
    { id: 2, date: "May 01, 2025 14:45", url: "#" },
    { id: 2, date: "Apr 15, 2025 14:45", url: "#" },
    { id: 2, date: "Apr 01, 2025 14:45", url: "#" },
    { id: 2, date: "Mar 01, 2025 14:45", url: "#" },
  ]);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    // TODO: call your PDF-generation endpoint here
    await new Promise((r) => setTimeout(r, 1000));
    const now = new Date();
    const label = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setReports([{ id: reports.length + 1, date: label, url: "#" }, ...reports]);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white">
      {/* Header + Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports & Export</h1>
        <button
          onClick={generateReport}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Generating…" : "Generate PDF"}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded text-center">
          <div className="text-sm text-gray-400">Area Cleared</div>
          <div className="mt-1 text-xl font-medium">12 350 ha</div>
        </div>
        <div className="bg-gray-700 p-4 rounded text-center">
          <div className="text-sm text-gray-400">Mines Found</div>
          <div className="mt-1 text-xl font-medium">3 212</div>
        </div>
        <div className="bg-gray-700 p-4 rounded text-center">
          <div className="text-sm text-gray-400">Teams Active</div>
          <div className="mt-1 text-xl font-medium">16</div>
        </div>
      </div>

      {/* Past Reports */}
      <div className="bg-gray-700 p-4 rounded">
        <h2 className="text-lg font-medium mb-2">Past Reports</h2>
        {reports.length > 0 ? (
          <ul className="divide-y divide-gray-600">
            {reports.map((r) => (
              <li key={r.id} className="py-2 flex justify-between">
                <span className="text-sm">{r.date}</span>
                <a
                  href={r.url}
                  className="text-blue-400 hover:underline text-sm"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No reports yet.</p>
        )}
      </div>
    </div>
  );
}
