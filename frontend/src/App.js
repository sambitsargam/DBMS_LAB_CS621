// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Agents from './components/Agents';
import Owners from './components/Owners';
import Properties from './components/Properties';
import Sales from './components/Sales';
import Rentals from './components/Rentals';
import SalesReport from './components/SalesReport';
import RentalReport from './components/RentalReport';
import AgentReport from './components/AgentReport';  // New

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/owners" element={<Owners />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/sales-report" element={<SalesReport />} />
        <Route path="/rental-report" element={<RentalReport />} />
        <Route path="/agent-report" element={<AgentReport />} />  {/* New */}
      </Routes>
    </Router>
  );
}

export default App;
