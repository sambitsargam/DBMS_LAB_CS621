import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    OwnerID: '',
    Address: '',
    City: '',
    Locality: '',
    Size_sqft: '',
    Bedrooms: '',
    YearOfConstruction: '',
    SellingPrice: '',
    RentAmount: '',
    IsAvailableForSale: true,
    IsAvailableForRent: true
  });
  const [error, setError] = useState('');

  const fetchProperties = async () => {
    try {
      const res = await axios.get('http://localhost:3000/properties', { withCredentials: true });
      setProperties(res.data);
    } catch (err) {
      console.error('Error fetching properties');
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/properties', newProperty, { withCredentials: true });
      setNewProperty({
        OwnerID: '',
        Address: '',
        City: '',
        Locality: '',
        Size_sqft: '',
        Bedrooms: '',
        YearOfConstruction: '',
        SellingPrice: '',
        RentAmount: '',
        IsAvailableForSale: true,
        IsAvailableForRent: true
      });
      fetchProperties();
    } catch (err) {
      setError('Failed to add property');
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/properties/${id}`, { withCredentials: true });
      fetchProperties();
    } catch (err) {
      console.error('Delete failed');
    }
  };

  return (
    <div className="properties-container">
      <NavBar />
      <h2>Manage Properties</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddProperty}>
        <input
          type="number"
          name="OwnerID"
          placeholder="Owner ID"
          value={newProperty.OwnerID}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Address"
          placeholder="Address"
          value={newProperty.Address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="City"
          placeholder="City"
          value={newProperty.City}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Locality"
          placeholder="Locality"
          value={newProperty.Locality}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="Size_sqft"
          placeholder="Size (sqft)"
          value={newProperty.Size_sqft}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="Bedrooms"
          placeholder="Bedrooms"
          value={newProperty.Bedrooms}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="YearOfConstruction"
          placeholder="Year of Construction"
          value={newProperty.YearOfConstruction}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="SellingPrice"
          placeholder="Selling Price"
          value={newProperty.SellingPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="RentAmount"
          placeholder="Rent Amount"
          value={newProperty.RentAmount}
          onChange={handleChange}
        />
        <div>
          <label>
            Available For Sale:
            <select name="IsAvailableForSale" value={newProperty.IsAvailableForSale} onChange={handleChange}>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Available For Rent:
            <select name="IsAvailableForRent" value={newProperty.IsAvailableForRent} onChange={handleChange}>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
        </div>
        <button type="submit">Add Property</button>
      </form>
      <h3>Property List</h3>
      <ul>
        {properties.map((property) => (
          <li key={property.PropertyID}>
            {property.Address} - {property.City} - {property.Locality}{' '}
            <button onClick={() => handleDeleteProperty(property.PropertyID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Properties;
