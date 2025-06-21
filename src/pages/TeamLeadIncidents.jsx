import React, { useState } from "react";

export default function TeamLeadIncidents() {
  const [logs, setLogs] = useState([
    { date: "2025-06-21", text: "UXO reported in Sector 5 by Carlos" },
    { date: "2025-06-20", text: "Minor injury in Sector 3 — Alice OK" },
  ]);
  const [note, setNote] = useState("");

  const submit = () => {
    if (!note.trim()) return;
    setLogs([{ date: new Date().toLocaleDateString(), text: note }, ...logs]);
    setNote("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">Incident Log</h1>
        <p className="text-gray-400">Report and review incidents</p>
      </header>

      <div className="space-y-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Describe a new incident..."
          className="w-full bg-gray-700 p-3 rounded-lg text-white placeholder-gray-400"
          rows={3}
        />
        <button
          onClick={submit}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
        >
          Submit Incident
        </button>
      </div>

      <ul className="divide-y divide-gray-600">
        {logs.map((l, i) => (
          <li key={i} className="py-3">
            <div className="text-gray-300 text-sm">{l.date}</div>
            <div className="mt-1">{l.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
