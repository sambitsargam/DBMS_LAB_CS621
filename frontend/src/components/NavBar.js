import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/agents">Agents</Link></li>
        <li><Link to="/owners">Owners</Link></li>
        <li><Link to="/properties">Properties</Link></li>
        <li><Link to="/sales">Sales</Link></li>
        <li><Link to="/rentals">Rentals</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
