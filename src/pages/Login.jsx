import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("teamLead");
  const [partner, setPartner] = useState("A");         // NEW: partner code
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password");
      return;
    }
    // Pass partner through only for NGO role
    onLogin({ role, username, partner: role === "ngo" ? partner : undefined });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-gray-700 p-8 rounded-lg w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role */}
          <div>
            <label className="block text-gray-300 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-600 text-white p-2 rounded"
            >
              <option value="operator">Operator</option>
              <option value="teamLead">Team Lead</option>
              <option value="ngo">NGO / Partner</option>
              <option value="gov">Government / UN</option>
            </select>
          </div>

          {/* Partner code for NGOs */}
          {role === "ngo" && (
            <div>
              <label className="block text-gray-300 mb-1">Partner</label>
              <select
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                className="w-full bg-gray-600 text-white p-2 rounded"
              >
                <option value="A">Partner A</option>
                <option value="B">Partner B</option>
                <option value="C">Partner C</option>
              </select>
            </div>
          )}

          {/* Credentials */}
          <div>
            <label className="block text-gray-300 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-600 text-white p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-600 text-white p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
