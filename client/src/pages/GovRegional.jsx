// src/pages/GovRegional.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend as PieLegend,
  Tooltip as PieTooltip,
} from "recharts";

export default function GovRegional() {
  const data = [
    { region: "Donetsk", cleared: 12000, incidents: 128, teams: 6 },
    { region: "Luhansk", cleared:  8500, incidents:  72, teams: 4 },
    { region: "Kharkiv", cleared:  6000, incidents:  56, teams: 3 },
    { region: "Kyiv",    cleared:  5000, incidents:  34, teams: 2 },
  ];

  // Compute totals
  const totals = data.reduce(
    (acc, r) => {
      acc.cleared += r.cleared;
      acc.incidents += r.incidents;
      acc.teams += r.teams;
      return acc;
    },
    { cleared: 0, incidents: 0, teams: 0 }
  );

  const COLORS = ["#00d8c3", "#FF6B6B", "#FFD93D", "#5F27CD"];

  return (
    <div className="min-h-screen bg-[#0E1324] text-[#E0E6ED] p-6 space-y-8">
      {/* Header + Totals */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Regional Progress</h1>
        <p className="text-[#7A8FA6]">Breakdown by oblast / region</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {[
            { label: "Total Area Cleared",      value: `${totals.cleared.toLocaleString()} ha` },
            { label: "Total Incidents",         value: totals.incidents.toLocaleString()     },
            { label: "Total Teams Active",      value: totals.teams                         },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1B2330] p-4 rounded-2xl shadow-md"
            >
              <div className="text-sm text-[#7A8FA6]">{stat.label}</div>
              <div className="mt-1 text-2xl font-semibold">{stat.value}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Table */}
      <div className="bg-[#1B2330] rounded-2xl overflow-auto shadow-md">
        <table className="min-w-full text-left">
          <thead className="bg-[#16202A]">
            <tr>
              <th className="px-4 py-3 text-sm text-[#7A8FA6]">Region</th>
              <th className="px-4 py-3 text-sm text-[#7A8FA6]">Area Cleared (ha)</th>
              <th className="px-4 py-3 text-sm text-[#7A8FA6]">Incidents</th>
              <th className="px-4 py-3 text-sm text-[#7A8FA6]">Teams Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#16202A]">
            {data.map((r) => (
              <tr key={r.region}>
                <td className="px-4 py-3">{r.region}</td>
                <td className="px-4 py-3">{r.cleared.toLocaleString()}</td>
                <td className="px-4 py-3">{r.incidents}</td>
                <td className="px-4 py-3">{r.teams}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-[#1B2330] p-4 rounded-2xl shadow-md">
          <h2 className="text-lg font-medium mb-3">Area Cleared by Region</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#16202A" strokeDasharray="3 3" />
              <XAxis dataKey="region" stroke="#7A8FA6" />
              <YAxis stroke="#7A8FA6" />
              <BarTooltip contentStyle={{ backgroundColor: "#0E1324", border: "none" }} itemStyle={{ color: "#E0E6ED" }} />
              <Bar dataKey="cleared" fill="#00d8c3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#1B2330] p-4 rounded-2xl shadow-md">
          <h2 className="text-lg font-medium mb-3">Incidents Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey="incidents"
                nameKey="region"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={{ fill: "#E0E6ED" }}
              >
                {data.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <PieLegend
                verticalAlign="bottom"
                wrapperStyle={{ color: "#E0E6ED", marginTop: 10 }}
              />
              <PieTooltip
                wrapperStyle={{ backgroundColor: "#0E1324", border: "none" }}
                itemStyle={{ color: "#E0E6ED" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

