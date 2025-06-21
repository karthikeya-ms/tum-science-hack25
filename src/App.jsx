// import NgoHome from "./pages/NgoHome";

// export default function App() {
//   return (
//     <div className="min-h-screen p-6">
//       <NgoHome />
//     </div>
//   );
// }

// src/App.jsx

// import NgoOperations from "./pages/NgoOperations";

// export default function App() {
//   return (
//     <div className="min-h-screen bg-gray-800 p-6">
//       <NgoOperations />
//     </div>
//   );
// }

// src/App.jsx
// import NgoReports from "./pages/NgoReports";

// export default function App() {
//   return (
//     <div className="min-h-screen bg-gray-800 p-6">
//       <NgoReports />
//     </div>
//   );
// }

// src/App.jsx
import { useState } from "react";
import NgoHome from "./pages/NgoHome";
import NgoOperations from "./pages/NgoOperations";
import NgoReports from "./pages/NgoReports";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <NgoHome />;
      case "operations":
        return <NgoOperations />;
      case "reports":
        return <NgoReports />;
      default:
        return <NgoHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-4 ${
              activeTab === "overview"
                ? "text-white border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("operations")}
            className={`py-2 px-4 ${
              activeTab === "operations"
                ? "text-white border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Operations
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`py-2 px-4 ${
              activeTab === "reports"
                ? "text-white border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Reports
          </button>
        </div>
        {/* Page Content */}
        {renderContent()}
      </div>
    </div>
  );
}


