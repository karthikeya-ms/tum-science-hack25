# TUM Science Hackathon 2025: Demining Dashboard

## Overview

This project consists of:

- **Frontend**: A React application (Vite + Tailwind via CDN) with role‑based dashboards for:

  - **Operator**
  - **Team Lead**
  - **NGO / Partner**
  - **Government / UN**

- **Backend**: A FastAPI service that generates a synthetic landmine‐risk map for Ukraine and serves it as a cached PNG.

## Prerequisites

- **Node.js & npm** (v16+)
- **Python 3.8+**
- **pip** for Python packages
- (Optional) **conda** or **venv** for Python virtual environments

## Project Structure

```
tum-science-hack25/       # Project root
├── backend/               # FastAPI + Python map generator
│   ├── ua.json            # Ukraine GeoJSON boundary
│   ├── map_generator.py   # Risk map logic
│   └── server.py          # FastAPI app (caches map PNG)
├── src/                   # React app
│   ├── pages/             # Role-based page components
│   │   ├── Login.jsx
│   │   ├── OperatorHome.jsx
│   │   ├── OperatorTasks.jsx
│   │   ├── OperatorIncidents.jsx
│   │   ├── TeamLeadHome.jsx
│   │   ├── TeamLeadAssignments.jsx
│   │   ├── TeamLeadIncidents.jsx
│   │   ├── NgoHome.jsx
│   │   ├── NgoOperations.jsx
│   │   ├── NgoReports.jsx
│   │   ├── GovOverview.jsx
│   │   ├── GovRegional.jsx
│   │   └── GovDownload.jsx
│   ├── App.jsx            # Main app with login & tabs
│   ├── main.jsx           # React entry point
│   └── index.html         # HTML template (includes Tailwind CDN)
├── package.json           # Frontend dependencies & scripts
├── vite.config.js         # Vite config (optional customization)
└── README.md              # This file
```

## Getting Started

### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd tum-science-hack25/backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate   # Linux/macOS
   .\.venv\\Scripts\\activate  # Windows
   ```
3. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn geopandas shapely rtree matplotlib
   ```
4. Start the FastAPI server (caches the risk map at startup):
   ```bash
   uvicorn server:app --reload --port 8000
   ```
   You should see:
   ```
   🗺️  Risk map ready at -> http://localhost:8000/risk-map/png
   ```

### 2. Frontend Setup

1. Open **another terminal** at the project root:
   ```bash
   cd tum-science-hack25
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open your browser to:
   ```
   http://localhost:5173
   ```

## Usage

1. **Login**: Select your role (Operator, Team Lead, NGO/Partner, Government/UN), enter any username/password, and click *Sign In*.
2. **Navigate**: Use the tabs to switch between pages relevant to your role.
3. **Generate Map** (Government overview): Click *Generate Risk Map* to fetch the cached PNG from the backend and display it instantly.

## Notes

- The backend map generation runs once at startup and serves a cached image for speed.
- Tailwind is included via CDN in `index.html`—no local CSS build step required.
- To adjust the risk‐grid resolution or partner shares, edit `map_generator.py`.

---

