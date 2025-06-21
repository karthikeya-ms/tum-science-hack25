// src/App.jsx

import React, { useState } from "react";
import Login from "./pages/Login";
import { TeamLeadProvider } from "./contexts/TeamLeadContext";

// Operator pages
import OperatorHome from "./pages/OperatorHome";
import OperatorTasks from "./pages/OperatorTasks";
import OperatorIncidents from "./pages/OperatorIncidents";

// Team Lead pages
import TeamLeadHome from "./pages/TeamLeadHome";
import TeamLeadAssignments from "./pages/TeamLeadAssignments";
import TeamLeadIncidents from "./pages/TeamLeadIncidents";

// NGO pages
import NgoHome from "./pages/NgoHome";
import NgoOperations from "./pages/NgoOperations";
import NgoReports from "./pages/NgoReports";

// Government/UN pages
import GovOverview from "./pages/GovOverview";
import GovRegional from "./pages/GovRegional";
import GovDownload from "./pages/GovDownload";

export default function App() {
  // user = { role: "operator"|"teamLead"|"ngo"|"gov", username: string, partner?: "A"|"B"|"C" }
  const [user, setUser] = useState(null);
  const [tab, setTab]   = useState("overview");

  // Show login form until authenticated
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Build tab lists per role
  const operatorTabs = [
    { key: "overview",  label: "Overview",  comp: <OperatorHome /> },
    { key: "tasks",     label: "Tasks",     comp: <OperatorTasks /> },
    { key: "incidents", label: "Incidents", comp: <OperatorIncidents /> },
  ];

  // TeamLead components wrapped with context provider
  const teamLeadTabs = [
    { key: "overview",    label: "Overview",    comp: <TeamLeadHome /> },
    { key: "assignments", label: "Assignments", comp: <TeamLeadAssignments /> },
    { key: "incidents",   label: "Incidents",   comp: <TeamLeadIncidents /> },
  ];

  const ngoTabs = [
    {
      key: "overview",
      label: "Overview",
      // pass partner code so NgoHome can fetch /risk-map/png?partner=X
      comp: <NgoHome partner={user.partner} />,
    },
    { key: "operations", label: "Operations", comp: <NgoOperations /> },
    { key: "reports",    label: "Reports",    comp: <NgoReports /> },
  ];

  const govTabs = [
    { key: "overview", label: "Overview", comp: <GovOverview /> },
    { key: "regional", label: "Regional", comp: <GovRegional /> },
    { key: "download", label: "Download", comp: <GovDownload /> },
  ];

  // Select correct tabs array
  let tabs;
  switch (user.role) {
    case "operator":
      tabs = operatorTabs;
      break;
    case "teamLead":
      tabs = teamLeadTabs;
      break;
    case "ngo":
      tabs = ngoTabs;
      break;
    case "gov":
      tabs = govTabs;
      break;
    default:
      tabs = operatorTabs;
  }

  // Ensure active tab is valid
  const active = tabs.find((t) => t.key === tab) || tabs[0];

  // Render content with TeamLead context if needed
  const renderContent = () => {
    if (user.role === "teamLead") {
      return (
        <TeamLeadProvider partner={user.partner}>
          {active.comp}
        </TeamLeadProvider>
      );
    }
    return active.comp;
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {user.role === "operator"
              ? "Operator"
              : user.role === "teamLead"
              ? `Team Lead - Partner ${user.partner}`
              : user.role === "ngo"
              ? `NGO Partner ${user.partner}`
              : "Government / UN"}{" "}
            Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{user.username}</span>
            <button
              onClick={() => {
                setUser(null);
                setTab("overview");
              }}
              className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-700 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-2 ${
                tab === t.key
                  ? "text-white border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Page Content */}
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}
