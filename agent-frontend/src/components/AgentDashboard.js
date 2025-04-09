// src/components/AgentDashboard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AgentDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3002/agent/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="container-box">
      <nav className="navbar">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/properties">My Properties</Link></li>
        </ul>
      </nav>
      <h1>Agent Dashboard</h1>
      <p>Welcome, Agent. Use the menu above to manage your properties.</p>
      <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
    </div>
  );
}

export default AgentDashboard;
