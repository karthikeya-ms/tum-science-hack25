import React, { useState } from "react";
import { useTeamLead } from "../contexts/TeamLeadContext";

export default function TeamLeadIncidents() {
  const { partner } = useTeamLead();
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
        <h1 className="text-3xl font-bold">Incident Log</h1>
        <p className="text-gray-400">
          Report and review incidents for Partner {partner} - {partnerInfo.region}
        </p>
      </header>

      {/* Partner Context */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Partner {partner} Operational Context</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400">Region: </span>
            <span className="text-white">{partnerInfo.region}</span>
          </div>
          <div>
            <span className="text-gray-400">Focus Area: </span>
            <span className="text-white">{partnerInfo.focus}</span>
          </div>
        </div>
      </div>

      {/* Incident Reporting */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Report New Incident</h2>
        <div className="space-y-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Describe a new incident in Partner ${partner} operations...`}
            className="w-full bg-gray-800 p-3 rounded-lg text-white placeholder-gray-400"
            rows={3}
          />
          <button
            onClick={submit}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
          >
            Submit Incident
          </button>
        </div>
      </div>

      {/* Incident History */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Incident History</h2>
        {logs.length > 0 ? (
          <ul className="divide-y divide-gray-600">
            {logs.map((l, i) => (
              <li key={i} className="py-3">
                <div className="text-gray-300 text-sm">{l.date}</div>
                <div className="mt-1">{l.text}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No incidents reported yet.</p>
        )}
      </div>
    </div>
  );
}
