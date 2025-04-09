
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgentLogin from './components/AgentLogin';
import Dashboard from './components/Dashboard';
import PropertyDetails from './components/PropertyDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AgentLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
