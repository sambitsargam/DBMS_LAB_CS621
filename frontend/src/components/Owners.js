// src/components/Owners.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function Owners() {
  const [owners, setOwners] = useState([]);
  const [newOwner, setNewOwner] = useState({ Name: '', Contact: '', Email: '' });
  const [editingOwner, setEditingOwner] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState('');

  const fetchOwners = async () => {
    try {
      const res = await axios.get('http://localhost:3000/owners', { withCredentials: true });
      setOwners(res.data);
    } catch (err) {
      console.error('Error fetching owners');
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleChange = (e, forEdit = false) => {
    if (forEdit) {
      setEditingOwner({ ...editingOwner, [e.target.name]: e.target.value });
    } else {
      setNewOwner({ ...newOwner, [e.target.name]: e.target.value });
    }
  };

  const handleAddOwner = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/owners', newOwner, { withCredentials: true });
      setNewOwner({ Name: '', Contact: '', Email: '' });
      fetchOwners();
    } catch (err) {
      setError('Failed to add owner');
    }
  };

  const handleEditOwner = (owner) => {
    setEditingOwner(owner);
  };

  const handleUpdateOwner = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/owners/${editingOwner.OwnerID}`, editingOwner, { withCredentials: true });
      setEditingOwner(null);
      fetchOwners();
    } catch (err) {
      setError('Failed to update owner');
    }
  };

  const handleDeleteOwner = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/owners/${id}`, { withCredentials: true });
      fetchOwners();
    } catch (err) {
      console.error('Delete failed');
    }
  };

  const filteredOwners = owners.filter((owner) =>
    owner.Name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container-box">
      <NavBar />
      <h2>Manage Owners</h2>
      {error && <p className="error">{error}</p>}

      {/* Add New Owner Form (if not editing) */}
      {!editingOwner && (
        <form onSubmit={handleAddOwner} className="mb-4">
          <div className="form-group mb-2">
            <input
              type="text"
              name="Name"
              className="form-control"
              placeholder="Owner Name"
              value={newOwner.Name}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="Contact"
              className="form-control"
              placeholder="Contact"
              value={newOwner.Contact}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="email"
              name="Email"
              className="form-control"
              placeholder="Email"
              value={newOwner.Email}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Owner</button>
        </form>
      )}

      {/* Edit Owner Form */}
      {editingOwner && (
        <form onSubmit={handleUpdateOwner} className="mb-4">
          <h4>Editing Owner ID: {editingOwner.OwnerID}</h4>
          <div className="form-group mb-2">
            <input
              type="text"
              name="Name"
              className="form-control"
              placeholder="Owner Name"
              value={editingOwner.Name}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="Contact"
              className="form-control"
              placeholder="Contact"
              value={editingOwner.Contact}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="email"
              name="Email"
              className="form-control"
              placeholder="Email"
              value={editingOwner.Email}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success me-2">Update Owner</button>
          <button type="button" onClick={() => setEditingOwner(null)} className="btn btn-secondary">Cancel</button>
        </form>
      )}

      {/* Filter Input */}
      <input
        type="text"
        className="form-control filter-input"
        placeholder="Filter owners by name..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      {/* Animated Table */}
      <div className="table-container mt-3">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Owner ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.map((owner) => (
              <tr key={owner.OwnerID}>
                <td>{owner.OwnerID}</td>
                <td>{owner.Name}</td>
                <td>{owner.Contact}</td>
                <td>{owner.Email}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditOwner(owner)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteOwner(owner.OwnerID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Owners;
