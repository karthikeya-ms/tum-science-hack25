import React, { createContext, useContext, useState } from 'react';

const TeamLeadContext = createContext();

export const useTeamLead = () => {
  const context = useContext(TeamLeadContext);
  if (!context) {
    throw new Error('useTeamLead must be used within a TeamLeadProvider');
  }
  return context;
};

export const TeamLeadProvider = ({ children, partner }) => {
  // Partner-specific sectors
  const getPartnerSectors = () => {
    const sectorsByPartner = {
      A: ["1A","1B","1C","1D", "2A","2B","2C","2D", "3A","3B","3C","3D"],
      B: ["4A","4B","4C","4D", "5A","5B","5C","5D", "6A","6B","6C","6D"], 
      C: ["7A","7B","7C","7D", "8A","8B","8C","8D", "9A","9B","9C","9D"]
    };
    return sectorsByPartner[partner] || sectorsByPartner.A;
  };

  const allSectors = getPartnerSectors();

  // Operator assignments state
  const [assignments, setAssignments] = useState([
    { 
      member: "Alice",  
      sectors: [allSectors[0], allSectors[1], allSectors[2], allSectors[3]], 
      progress: 40,
      mines: 5,
      location: { lat: 49.988, lon: 36.232 },
      status: 'Working on assigned sectors'
    },
    { 
      member: "Bob",    
      sectors: [], 
      progress: 0,
      mines: 0,
      location: { lat: 49.99, lon: 36.24 },
      status: 'Idle — waiting assignment'
    },
    { 
      member: "Carlos", 
      sectors: [], 
      progress: 0,
      mines: 0,
      location: { lat: 49.995, lon: 36.22 },
      status: 'Idle — waiting assignment'
    },
  ]);

  // Give operator i the next 4 unassigned sectors
  const assignFour = (i) => {
    setAssignments(prev => {
      const used = prev.flatMap(a => a.sectors);
      const next4 = allSectors.filter(s => !used.includes(s)).slice(0, 4);
      const copy = [...prev];
      copy[i] = { 
        ...copy[i], 
        sectors: next4, 
        progress: 0,
        status: next4.length > 0 ? 'Working on assigned sectors' : 'Idle — waiting assignment'
      };
      return copy;
    });
  };

  // Update operator progress and status
  const updateOperator = (index, updates) => {
    setAssignments(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  // Get operator by name
  const getOperator = (name) => {
    return assignments.find(op => op.member === name);
  };

  const value = {
    assignments,
    setAssignments,
    assignFour,
    updateOperator,
    getOperator,
    allSectors,
    partner
  };

  return (
    <TeamLeadContext.Provider value={value}>
      {children}
    </TeamLeadContext.Provider>
  );
}; 