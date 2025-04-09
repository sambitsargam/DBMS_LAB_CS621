// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar mb-3">
      <ul className="d-flex">
        <li className="me-3"><Link to="/dashboard">Dashboard</Link></li>
        <li className="me-3"><Link to="/agents">Agents</Link></li>
        <li className="me-3"><Link to="/owners">Owners</Link></li>
        <li className="me-3"><Link to="/properties">Properties</Link></li>
        <li className="me-3"><Link to="/sales">Sales</Link></li>
        <li className="me-3"><Link to="/rentals">Rentals</Link></li>
        <li className="me-3"><Link to="/sales-report">Sales Report</Link></li>
        <li className="me-3"><Link to="/rental-report">Rental Report</Link></li>
        <li className="me-3"><Link to="/agent-report">Agent Report</Link></li> {/* New */}
      </ul>
    </nav>
  );
}

export default NavBar;
