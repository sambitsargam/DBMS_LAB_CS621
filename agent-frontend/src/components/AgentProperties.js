// src/components/AgentProperties.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AgentProperties() {
  const [properties, setProperties] = useState([]);
  const [filterText, setFilterText] = useState('');

  const fetchProperties = async () => {
    try {
      const res = await axios.get('http://localhost:3002/agent/properties', { withCredentials: true });
      setProperties(res.data);
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((prop) =>
    prop.Address.toLowerCase().includes(filterText.toLowerCase()) ||
    prop.City.toLowerCase().includes(filterText.toLowerCase()) ||
    prop.Locality.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container-box">
      <nav className="navbar">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/properties">My Properties</Link></li>
        </ul>
      </nav>
      <h2>My Properties</h2>
      <input
        type="text"
        className="form-control filter-input mb-3"
        placeholder="Filter properties..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <div className="table-container">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Property ID</th>
              <th>Address</th>
              <th>City</th>
              <th>Locality</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((prop) => (
              <tr key={prop.PropertyID}>
                <td>{prop.PropertyID}</td>
                <td>{prop.Address}</td>
                <td>{prop.City}</td>
                <td>{prop.Locality}</td>
                <td>
                  {prop.IsAvailableForSale ? "For Sale" : "Sold"} / {prop.IsAvailableForRent ? "For Rent" : "Rented"}
                </td>
                <td>
                  <Link to={`/property/${prop.PropertyID}`} className="btn btn-info btn-sm me-2">View / Update</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgentProperties;
