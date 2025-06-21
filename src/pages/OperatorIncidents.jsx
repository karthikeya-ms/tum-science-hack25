import React, { useState } from "react";

export default function OperatorIncidents() {
  const [logs, setLogs] = useState([
    { date: "Jun 21, 2025", text: "Mine discovered near grid A5" },
    { date: "Jun 20, 2025", text: "Low battery warning" },
  ]);
  const [note, setNote] = useState("");

  const submitLog = () => {
    if (!note.trim()) return;
    setLogs([{ date: new Date().toLocaleDateString(), text: note }, ...logs]);
    setNote("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">Incident Log</h1>
        <p className="text-gray-400">Report new issues or discoveries</p>
      </header>

      <div className="space-y-4">
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Describe incident..."
          className="w-full bg-gray-700 p-3 rounded-lg text-white placeholder-gray-400"
        />
        <button
          onClick={submitLog}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-white"
        >
          Submit
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
