import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function Owners() {
  const [owners, setOwners] = useState([]);
  const [newOwner, setNewOwner] = useState({ Name: '', Contact: '', Email: '' });
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

  const handleChange = (e) => {
    setNewOwner({ ...newOwner, [e.target.name]: e.target.value });
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
      
      <form onSubmit={handleAddOwner} className="mb-4">
        <div className="form-group mb-2">
          <input
            type="text"
            name="Name"
            className="form-control"
            placeholder="Owner Name"
            value={newOwner.Name}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Owner</button>
      </form>
      
      <input
        type="text"
        className="form-control filter-input"
        placeholder="Filter owners by name..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      
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
