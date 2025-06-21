import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("");             // start blank
  const [partner, setPartner] = useState("A");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !role) {
      return alert("Please enter username, password, and select a role");
    }
    onLogin({
      role,
      username,
      partner: (role === "ngo" || role === "teamLead") ? partner : undefined
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      return alert("Please fill out all fields");
    }
    alert(`Signing up ${name} with ${email}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0f1f2e 20%, #1e364e 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-[#1f2a36] bg-opacity-90 rounded-2xl shadow-xl space-y-6">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">MineLink</h1>
          <p className="mt-1 text-teal-300 text-sm">
            Secure Communication for Demining Teams
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center space-x-8">
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`pb-2 text-sm font-medium ${
                mode === m
                  ? "border-b-2 border-teal-300 text-white"
                  : "text-gray-500"
              }`}
            >
              {m === "login" ? "Login" : "Sign up"}
            </button>
          ))}
        </div>

        {/* Forms */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 text-white py-2 placeholder-gray-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 text-white py-2 placeholder-gray-500 focus:outline-none"
            />

            {/* Role selector with placeholder */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#27323e] text-gray-200 py-2 px-3 rounded"
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="operator">Operator</option>
              <option value="teamLead">Team Lead</option>
              <option value="ngo">NGO / Partner</option>
              <option value="gov">Government / UN</option>
            </select>

            {/* Conditional partner select */}
            {(role === "ngo" || role === "teamLead") && (
              <select
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                className="w-full bg-[#27323e] text-gray-200 py-2 px-3 rounded"
              >
                <option value="A">Partner A</option>
                <option value="B">Partner B</option>
                <option value="C">Partner C</option>
              </select>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 hover:from-teal-500 hover:to-green-500 text-gray-900 font-semibold transition"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 text-white py-2 placeholder-gray-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 text-white py-2 placeholder-gray-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 text-white py-2 placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 hover:from-teal-500 hover:to-green-500 text-gray-900 font-semibold transition"
            >
              Sign up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
