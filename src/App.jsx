// src/App.jsx
import { useState } from "react";
import Login from "./pages/Login";
import NgoHome from "./pages/NgoHome";
import NgoOperations from "./pages/NgoOperations";
import NgoReports from "./pages/NgoReports";
import GovOverview from "./pages/GovOverview";
import GovRegional from "./pages/GovRegional";
import GovDownload from "./pages/GovDownload";

export default function App() {
  const [user, setUser] = useState(null);           // { role, username }
  const [tab, setTab] = useState("overview");       // current tab key

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Define tabs per role
  const ngoTabs = [
    { key: "overview", label: "Overview", comp: <NgoHome /> },
    { key: "operations", label: "Operations", comp: <NgoOperations /> },
    { key: "reports", label: "Reports", comp: <NgoReports /> },
  ];
  const govTabs = [
    { key: "overview", label: "Overview", comp: <GovOverview /> },
    { key: "regional", label: "Regional", comp: <GovRegional /> },
    { key: "download", label: "Download", comp: <GovDownload /> },
  ];
  const tabs = user.role === "gov" ? govTabs : ngoTabs;
  const active = tabs.find((t) => t.key === tab) || tabs[0];

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {user.role === "gov" ? "Government / UN" : "NGO / Partner"} Dashboard
          </h1>
          <div>
            <span className="mr-4 text-gray-300">{user.username}</span>
            <button
              onClick={() => setUser(null)}
              className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-700">
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

        {/* Page Content */}
        <div>{active.comp}</div>
      </div>
    </div>
  );
}





// // src/App.jsx
// import { useState } from "react";
// import NgoHome from "./pages/NgoHome";
// import NgoOperations from "./pages/NgoOperations";
// import NgoReports from "./pages/NgoReports";

// export default function App() {
//   const [activeTab, setActiveTab] = useState("overview");

//   const renderContent = () => {
//     switch (activeTab) {
//       case "overview":
//         return <NgoHome />;
//       case "operations":
//         return <NgoOperations />;
//       case "reports":
//         return <NgoReports />;
//       default:
//         return <NgoHome />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-800 text-white p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Tabs */}
//         <div className="flex space-x-4 border-b border-gray-700 mb-6">
//           <button
//             onClick={() => setActiveTab("overview")}
//             className={`py-2 px-4 ${
//               activeTab === "overview"
//                 ? "text-white border-b-2 border-blue-400"
//                 : "text-gray-400 hover:text-white"
//             }`}
//           >
//             Overview
//           </button>
//           <button
//             onClick={() => setActiveTab("operations")}
//             className={`py-2 px-4 ${
//               activeTab === "operations"
//                 ? "text-white border-b-2 border-blue-400"
//                 : "text-gray-400 hover:text-white"
//             }`}
//           >
//             Operations
//           </button>
//           <button
//             onClick={() => setActiveTab("reports")}
//             className={`py-2 px-4 ${
//               activeTab === "reports"
//                 ? "text-white border-b-2 border-blue-400"
//                 : "text-gray-400 hover:text-white"
//             }`}
//           >
//             Reports
//           </button>
//         </div>
//         {/* Page Content */}
//         {renderContent()}
//       </div>
//     </div>
//   );
// }


