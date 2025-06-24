import React, { useState } from "react";

export default function OperatorTasks() {
  const [tasks, setTasks] = useState([
    { sector: "12-A", desc: "Scan for mines", done: false },
    { sector: "12-B", desc: "Mark vegetation", done: false },
    { sector: "12-C", desc: "Collect soil samples", done: true },
  ]);

  const toggleDone = (i) => {
    const copy = [...tasks];
    copy[i].done = !copy[i].done;
    setTasks(copy);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-gray-400">Complete your assigned tasks</p>
      </header>

      <ul className="space-y-4">
        {tasks.map((t, i) => (
          <li
            key={i}
            className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{t.sector}</div>
              <div className="text-gray-300 text-sm">{t.desc}</div>
            </div>
            <button
              onClick={() => toggleDone(i)}
              className={`px-3 py-1 rounded ${
                t.done ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"
              } text-white text-sm`}
            >
              {t.done ? "Completed" : "Mark Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
