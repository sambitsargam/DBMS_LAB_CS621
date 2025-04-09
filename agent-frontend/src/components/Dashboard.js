
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      const res = await axios.get('http://localhost:4000/agent/properties', { withCredentials: true });
      setProperties(res.data);
    } catch {
      navigate('/');
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleLogout = async () => {
    await axios.post('http://localhost:4000/agent/logout', {}, { withCredentials: true });
    navigate('/');
  };

  return (
    <div className="container-box">
      <h2>Assigned Properties</h2>
      <button onClick={handleLogout} className="btn btn-secondary mb-3">Logout</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Property ID</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {properties.map(p => (
            <tr key={p.PropertyID}>
              <td>{p.PropertyID}</td>
              <td>{p.Address}, {p.City}</td>
              <td>
                {p.IsAvailableForSale ? 'For Sale' : 'Sold'} / {p.IsAvailableForRent ? 'For Rent' : 'Rented'}
              </td>
              <td><Link to={`/property/${p.PropertyID}`} className="btn btn-sm btn-info">Update</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
