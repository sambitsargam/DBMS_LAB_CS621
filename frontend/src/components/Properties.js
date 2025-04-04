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
  const [filterText, setFilterText] = useState('');
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

  const filteredProperties = properties.filter((property) =>
    property.Address.toLowerCase().includes(filterText.toLowerCase()) ||
    property.City.toLowerCase().includes(filterText.toLowerCase()) ||
    property.Locality.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container-box">
      <NavBar />
      <h2>Manage Properties</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleAddProperty} className="mb-4">
        <div className="form-group mb-2">
          <input
            type="number"
            name="OwnerID"
            className="form-control"
            placeholder="Owner ID"
            value={newProperty.OwnerID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="text"
            name="Address"
            className="form-control"
            placeholder="Address"
            value={newProperty.Address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="text"
            name="City"
            className="form-control"
            placeholder="City"
            value={newProperty.City}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="text"
            name="Locality"
            className="form-control"
            placeholder="Locality"
            value={newProperty.Locality}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="Size_sqft"
            className="form-control"
            placeholder="Size (sqft)"
            value={newProperty.Size_sqft}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="Bedrooms"
            className="form-control"
            placeholder="Bedrooms"
            value={newProperty.Bedrooms}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="YearOfConstruction"
            className="form-control"
            placeholder="Year of Construction"
            value={newProperty.YearOfConstruction}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="SellingPrice"
            className="form-control"
            placeholder="Selling Price"
            value={newProperty.SellingPrice}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="RentAmount"
            className="form-control"
            placeholder="Rent Amount"
            value={newProperty.RentAmount}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-2">
          <label>Available For Sale: </label>
          <select name="IsAvailableForSale" className="form-select" value={newProperty.IsAvailableForSale} onChange={handleChange}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
        <div className="form-group mb-2">
          <label>Available For Rent: </label>
          <select name="IsAvailableForRent" className="form-select" value={newProperty.IsAvailableForRent} onChange={handleChange}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add Property</button>
      </form>
      
      <input
        type="text"
        className="form-control filter-input"
        placeholder="Filter by Address, City, or Locality..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      
      <div className="table-container mt-3">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Property ID</th>
              <th>Owner ID</th>
              <th>Address</th>
              <th>City</th>
              <th>Locality</th>
              <th>Bedrooms</th>
              <th>Price/Rent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.PropertyID}>
                <td>{property.PropertyID}</td>
                <td>{property.OwnerID}</td>
                <td>{property.Address}</td>
                <td>{property.City}</td>
                <td>{property.Locality}</td>
                <td>{property.Bedrooms}</td>
                <td>
                  {property.IsAvailableForSale ? `Rs. ${property.SellingPrice}` : ''}
                  {property.IsAvailableForRent ? ` / Rs. ${property.RentAmount}` : ''}
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProperty(property.PropertyID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Properties;
