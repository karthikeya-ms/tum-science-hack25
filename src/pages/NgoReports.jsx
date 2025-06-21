// src/pages/NgoReports.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function NgoReports() {
  const [tableData, setTableData] = useState([]);

  // Handler to read the uploaded file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // Convert sheet to JSON array of objects
      const data = XLSX.utils.sheet_to_json(ws);
      setTableData(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-white">Reports & Export</h1>
        <p className="text-gray-400">Upload an Excel file to populate the chart</p>
      </header>

      {/* File Upload */}
      <div>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="text-gray-200"
        />
      </div>

      {/* Display raw table data for now */}
      {tableData.length > 0 && (
        <div className="bg-gray-700 p-4 rounded-lg overflow-auto">
          <table className="min-w-full text-left divide-y divide-gray-600">
            <thead>
              <tr>
                {Object.keys(tableData[0]).map((col) => (
                  <th key={col} className="px-4 py-2 text-gray-400">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {tableData.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="px-4 py-2 text-gray-200">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
