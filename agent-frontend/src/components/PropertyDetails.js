// src/components/PropertyDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [status, setStatus] = useState(''); // "sold" or "rented"
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchPropertyDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3002/agent/property/${id}`, { withCredentials: true });
      setProperty(res.data);
    } catch (err) {
      console.error('Error fetching property details:', err);
      setError('Property not found or not assigned to you.');
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!status) return;
    try {
      const res = await axios.put(`http://localhost:3002/agent/property/${id}/status`, { status }, { withCredentials: true });
      setMessage(res.data.message);
      fetchPropertyDetails();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update property status.');
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
      <h2>Property Details</h2>
      {error && <p className="error">{error}</p>}
      {property && (
        <div>
          <p><strong>Property ID:</strong> {property.PropertyID}</p>
          <p><strong>Address:</strong> {property.Address}</p>
          <p><strong>City:</strong> {property.City}</p>
          <p><strong>Locality:</strong> {property.Locality}</p>
          <p>
            <strong>Status:</strong> {property.IsAvailableForSale ? "For Sale" : "Sold"} / {property.IsAvailableForRent ? "For Rent" : "Rented"}
          </p>
          <div className="mb-3">
            <label>Update Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-select"
            >
              <option value="">Select status</option>
              <option value="sold">Mark as Sold</option>
              <option value="rented">Mark as Rented</option>
            </select>
          </div>
          <button onClick={handleStatusUpdate} className="btn btn-primary">Update Status</button>
          {message && <p className="mt-2 text-success">{message}</p>}
        </div>
      )}
      <button onClick={() => navigate(-1)} className="btn btn-secondary mt-3">Back</button>
    </div>
  );
}

export default PropertyDetails;
