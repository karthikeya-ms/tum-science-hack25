import React, { useState } from "react";

export default function Login({ onLogin, onEmergency }) {
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
    <div className="relative min-h-screen flex overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0f1f2e 20%, #1e364e 100%)",
        }}
      />
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          backgroundImage:
            "linear-gradient(rgba(64,224,208,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,208,0.12) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          animation: "gridPulse 4s ease-in-out infinite alternate",
        }}
      />
      
      {/* Add custom keyframes for grid animation */}
      <style jsx>{`
        @keyframes gridPulse {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(64,224,208,0.5), 0 0 40px rgba(64,224,208,0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(64,224,208,0.8), 0 0 60px rgba(64,224,208,0.5);
          }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .glow-text {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Emergency Button - Fixed Position */}
      <button
        onClick={onEmergency}
        className="fixed top-6 right-6 z-30 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
      >
        <span className="text-xl"></span>
        <span>Report Emergency</span>
      </button>

      {/* Left Side - Branding */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-12">
        <div className="text-center space-y-8">
          {/* Main Logo */}
          <div className="float-animation">
            <h1 className="text-8xl md:text-9xl font-black text-white glow-text tracking-wider">
              Mine<span className="text-teal-300">Link.</span>
            </h1>
          </div>
          
          {/* Tagline */}
          <div className="space-y-4">
            <p className="text-2xl md:text-3xl text-teal-300 font-light tracking-wide">
              Secure Communication
            </p>
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              for Demining Operations
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="flex justify-center items-center mt-12">
            {/* Horizontal Logo - Zig Zag Pattern */}
            <div className="flex items-center space-x-8 px-10 py-8 bg-gradient-to-r from-teal-500/10 to-green-500/10 rounded-3xl border border-teal-400/20 backdrop-blur-sm">
              {/* Signal/Communication Icon - Higher */}
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-400 rounded-full flex items-center justify-center transform -translate-y-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              
              {/* Connect/Link Icon - Lower */}
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center transform translate-y-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              
              {/* Shield/Protection Icon - Higher */}
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-400 rounded-full flex items-center justify-center transform -translate-y-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Mission Statement */}
          <div className="max-w-lg mx-auto mt-12 p-6 bg-[#1f2a36] bg-opacity-50 rounded-2xl border border-teal-500/20">
            <p className="text-gray-300 text-lg leading-relaxed">
              Connecting teams, coordinating operations, and saving lives through 
              <span className="text-teal-300 font-semibold"> secure communication technology</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-[#1f2a36] bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl border border-teal-500/30 p-8 space-y-6">
          {/* Form Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-teal-300 text-sm">
              Access your secure workspace
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center bg-[#27323e] rounded-xl p-1">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === m
                    ? "bg-gradient-to-r from-teal-400 to-green-400 text-gray-900 shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Forms */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#27323e] border border-teal-500/20 text-white py-3 px-4 rounded-xl placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#27323e] border border-teal-500/20 text-white py-3 px-4 rounded-xl placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                  />
                </div>
              </div>

              {/* Role selector */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#27323e] border border-teal-500/20 text-white py-3 px-4 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
              >
                <option value="" disabled>
                  Select Your Role
                </option>
                <option value="operator">Field Operator</option>
                <option value="teamLead">Team Leader</option>
                <option value="ngo">NGO Partner</option>
                <option value="gov">Government / UN</option>
              </select>

              {/* Conditional partner select */}
              {(role === "ngo" || role === "teamLead") && (
                <select
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  className="w-full bg-[#27323e] border border-teal-500/20 text-white py-3 px-4 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                >
                  <option value="A">Partner A - Central Sector</option>
                  <option value="B">Partner B - Eastern Sector</option>
                  <option value="C">Partner C - Western Sector</option>
                </select>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 hover:from-teal-500 hover:to-green-500 text-gray-900 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#27323e] border border-teal-500/20 text-white py-3 px-4 rounded-xl placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#27323e] border border-teal-500/20 text-white py-3 px-4 rounded-xl placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                />
                <input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#27323e] border border-teal-500/20 text-white py-3 px-4 rounded-xl placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 hover:from-teal-500 hover:to-green-500 text-gray-900 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Create Account
              </button>
            </form>
          )}

          {/* Emergency Notice */}
          <div className="text-center pt-4 border-t border-gray-600/50">
            <p className="text-gray-400 text-xs leading-relaxed">
              🚨 For emergency situations involving suspicious objects or unexploded ordnance, 
              use the <span className="text-red-400 font-medium">Report Emergency</span> button above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
