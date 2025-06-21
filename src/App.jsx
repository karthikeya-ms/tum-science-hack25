import React, { useState } from "react";
import Login from "./pages/Login";

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
  const [user, setUser] = useState(null);  // { role, username }
  const [tab, setTab]   = useState("overview");

  // Show login if not signed in
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Define tab sets per role
  const operatorTabs = [
    { key: "overview",  label: "Overview",  comp: <OperatorHome /> },
    { key: "tasks",     label: "Tasks",     comp: <OperatorTasks /> },
    { key: "incidents", label: "Incidents", comp: <OperatorIncidents /> },
  ];
  const teamLeadTabs = [
    { key: "overview",    label: "Overview",    comp: <TeamLeadHome /> },
    { key: "assignments", label: "Assignments", comp: <TeamLeadAssignments /> },
    { key: "incidents",   label: "Incidents",   comp: <TeamLeadIncidents /> },
  ];
  const ngoTabs = [
    { key: "overview",    label: "Overview",    comp: <NgoHome /> },
    { key: "operations",  label: "Operations",  comp: <NgoOperations /> },
    { key: "reports",     label: "Reports",     comp: <NgoReports /> },
  ];
  const govTabs = [
    { key: "overview",    label: "Overview",    comp: <GovOverview /> },
    { key: "regional",    label: "Regional",    comp: <GovRegional /> },
    { key: "download",    label: "Download",    comp: <GovDownload /> },
  ];

  // Pick the right tabs based on role
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

  // Ensure the current tab exists
  const activeTab = tabs.find((t) => t.key === tab) || tabs[0];

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold capitalize">
            {user.role === "operator"
              ? "Operator"
              : user.role === "teamLead"
              ? "Team Lead"
              : user.role === "ngo"
              ? "NGO / Partner"
              : "Government / UN"} Dashboard
          </h1>
          <div>
            <span className="mr-4 text-gray-300">{user.username}</span>
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

        {/* Active Page */}
        <div>{activeTab.comp}</div>
      </div>
    </div>
  );
}
