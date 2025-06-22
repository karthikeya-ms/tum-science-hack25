// src/pages/NgoReports.jsx
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function NgoReports() {
  const [tableData, setTableData] = useState([]);
  const chartRef = useRef(null);

  // Load Excel file from public/assets on mount
  useEffect(() => {
    fetch("../../assets/operator_monthly_example.xlsx")
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setTableData(data);
      });
  }, []);
  

  // Helper to convert Excel serial date to readable month
  const excelDateToMonthYear = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400; // seconds
    const dateInfo = new Date(utcValue * 1000);
    return dateInfo.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  // Bar chart data (month vs mines found)
  const barData = {
    labels: tableData.map((row) => excelDateToMonthYear(row["Month"])),
    datasets: [
      {
        label: "Mines Found",
        data: tableData.map((row) => Number(row["MinesFound"])),
        backgroundColor: "#f7faff",
      },
    ],
  };

  // Summary statistics
  const totalMines = tableData.reduce((sum, row) => sum + Number(row["MinesFound"] || 0), 0);
  const avgMines = (totalMines / tableData.length).toFixed(2);
  const maxMines = Math.max(...tableData.map(row => Number(row["MinesFound"] || 0)));
  const minMines = Math.min(...tableData.map(row => Number(row["MinesFound"] || 0)));

  // Export charts to PDF
  // const generatePDFfromBackend = async () => {
  //   const res = await fetch("http://localhost:8000/generate-pdf", {
  //     method: "POST",
  //   });
  
  //   const blob = await res.blob();
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "ngo_activity_report.pdf";
  //   a.click();
  // };

  const generatePDFfromBackend = async () => {
    try {
      const res = await fetch("http://localhost:8000/generate-pdf", {
        method: "POST",
      });
  
      if (!res.ok) {
        console.error("Failed to fetch PDF:", res.statusText);
        return;
      }
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ngo_activity_report.pdf";
      a.click();
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">NGO Reports</h1>
        <p className="text-gray-400">Automatically loaded Excel data from assets folder</p>
      </header>

      {tableData.length > 0 && (
        <div className="space-y-10" ref={chartRef}>
          {/* Bar Chart */}
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl text-white mb-2">Mines Found per Month</h2>
            <Bar data={barData} />
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow text-white space-y-2">
            <h2 className="text-xl mb-2">Summary Statistics</h2>
            <p>Total Mines found: {totalMines}</p>
            <p>Average Mines found per Month: {avgMines}</p>
            <p>Maximum Mines found in a Month: {maxMines}</p>
            <p>Minimum Mines found in a Month: {minMines}</p>
          </div>
        </div>
        
      )}

      {/* Export PDF Button */}
      {tableData.length > 0 && (
        <div className="text-center">
          <button
            onClick={generatePDFfromBackend}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Export Charts to PDF
          </button>
        </div>
      )}
    </div>
  );
}
