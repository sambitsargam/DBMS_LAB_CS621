
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [status, setStatus] = useState('');
  const [marketTime, setMarketTime] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchProperty = async () => {
    try {
      const res = await axios.get('http://localhost:3002/agent/properties', { withCredentials: true });
      const prop = res.data.find(p => p.PropertyID.toString() === id);
      if (!prop) navigate('/dashboard');
      setProperty(prop);
    } catch {
      navigate('/');
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await axios.post(`http://localhost:3002/agent/property/${id}/mark`, { status, marketTime }, { withCredentials: true });
      setMessage(res.data.message);
      fetchProperty();
    } catch (err) {
      setMessage('Error updating status');
    }
  };

  return (
    <div className="container-box">
      {property && (
        <>
          <h3>Property #{property.PropertyID}</h3>
          <p><strong>Address:</strong> {property.Address}, {property.City}, {property.Locality}</p>
          <p><strong>Status:</strong> {property.IsAvailableForSale ? 'For Sale' : 'Sold'} / {property.IsAvailableForRent ? 'For Rent' : 'Rented'}</p>

          <select className="form-select mb-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            {property.IsAvailableForSale && <option value="sold">Mark as Sold</option>}
            {property.IsAvailableForRent && <option value="rented">Mark as Rented</option>}
          </select>

          <input type="number" className="form-control mb-2" placeholder="Market time (in days)" value={marketTime} onChange={(e) => setMarketTime(e.target.value)} />
          <button className="btn btn-primary" onClick={handleUpdate}>Submit</button>
          {message && <p className="mt-2">{message}</p>}
        </>
      )}
    </div>
  );
}

export default PropertyDetails;
