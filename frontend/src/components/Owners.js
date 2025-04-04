import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function Owners() {
  const [owners, setOwners] = useState([]);
  const [newOwner, setNewOwner] = useState({ Name: '', Contact: '', Email: '' });
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

  return (
    <div className="owners-container">
      <NavBar />
      <h2>Manage Owners</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddOwner}>
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={newOwner.Name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Contact"
          placeholder="Contact"
          value={newOwner.Contact}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={newOwner.Email}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Owner</button>
      </form>
      <h3>Owner List</h3>
      <ul>
        {owners.map((owner) => (
          <li key={owner.OwnerID}>
            {owner.Name} - {owner.Email} - {owner.Contact}{' '}
            <button onClick={() => handleDeleteOwner(owner.OwnerID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Owners;
