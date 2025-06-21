// src/pages/Login.jsx
import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("ngo");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app you'd verify credentials; here we just pass them up
    onLogin({ role, username });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-gray-700 p-8 rounded-lg w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-600 text-white p-2 rounded"
            >
              <option value="ngo">NGO / Partner</option>
              <option value="gov">Government / UN</option>
              {/* you can add operator & teamLead here later */}
            </select>
          </div>
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
