// src/pages/GovOverview.jsx

import React, { useState } from "react";
import OpenStreetMap from "./OpenStreetMap";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function GovOverview() {
  const stats = [
    { label: "Area Cleared", value: 45000, unit: "ha", color: "#00d8c3" },
    { label: "Population Impacted", value: 600000, unit: "", color: "#FFD93D" },
    { label: "Economic Value", value: 80, unit: "M$", color: "#FF6B6B" },
  ];

  return (
    <div className="min-h-screen bg-[#0E1324] p-6 space-y-8 text-[#E0E6ED]">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">National Overview</h1>
          <p className="text-[#7A8FA6]">High-level metrics for decision makers</p>
        </div>
      </header>

      {/* Neon-Gauge Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s) => {
          // for radial bars we need a 0–max scale; pick a sensible max
          const domainMax = s.label === "Economic Value" ? 100 : s.value * 1.2;
          const data = [{ name: s.label, value: s.value, fill: s.color }];
          return (
            <div
              key={s.label}
              className="bg-[#1B2330] p-4 rounded-2xl shadow-md flex flex-col items-center"
            >
              <ResponsiveContainer width="100%" height={150}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="100%"
                  barSize={12}
                  data={data}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background
                    clockWise
                    dataKey="value"
                    cornerRadius={6}
                    minAngle={15}
                  />
                  <Legend
                    iconSize={0}
                    layout="vertical"
                    verticalAlign="middle"
                    align="center"
                    formatter={() => ""}
                  />
                  <Tooltip
                    wrapperStyle={{ backgroundColor: "#16202A", border: "none" }}
                    contentStyle={{ color: "#E0E6ED" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <div className="text-sm text-[#7A8FA6]">{s.label}</div>
                <div className="text-2xl font-semibold">
                  {s.value.toLocaleString()}
                  {s.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operations Map */}
      <section className="bg-[#1B2330] p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Operations Area — Kharkiv Region</h2>
        <div className="h-80 rounded-lg overflow-hidden">
          <OpenStreetMap />
        </div>
      </section>
    </div>
  );
}
