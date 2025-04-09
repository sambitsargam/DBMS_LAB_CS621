import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgentLogin from './components/AgentLogin';
import AgentDashboard from './components/AgentDashboard';
import AgentProperties from './components/AgentProperties';
import PropertyDetails from './components/PropertyDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AgentLogin />} />
        <Route path="/dashboard" element={<AgentDashboard />} />
        <Route path="/properties" element={<AgentProperties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
