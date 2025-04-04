import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [newRental, setNewRental] = useState({
    PropertyID: '',
    AgentID: '',
    OwnerID: '',
    RentAmount: '',
    RentalStartDate: '',
    RentalEndDate: '',
    MarketTime: ''
  });
  const [error, setError] = useState('');

  const fetchRentals = async () => {
    try {
      const res = await axios.get('http://localhost:3000/rentals', { withCredentials: true });
      setRentals(res.data);
    } catch (err) {
      console.error('Error fetching rentals');
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleChange = (e) => {
    setNewRental({ ...newRental, [e.target.name]: e.target.value });
  };

  const handleAddRental = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/rentals', newRental, { withCredentials: true });
      setNewRental({
        PropertyID: '',
        AgentID: '',
        OwnerID: '',
        RentAmount: '',
        RentalStartDate: '',
        RentalEndDate: '',
        MarketTime: ''
      });
      fetchRentals();
    } catch (err) {
      setError('Failed to add rental transaction');
    }
  };

  const handleDeleteRental = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/rentals/${id}`, { withCredentials: true });
      fetchRentals();
    } catch (err) {
      console.error('Delete failed');
    }
  };

  return (
    <div className="rentals-container">
      <NavBar />
      <h2>Manage Rental Transactions</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddRental}>
        <input
          type="number"
          name="PropertyID"
          placeholder="Property ID"
          value={newRental.PropertyID}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="AgentID"
          placeholder="Agent ID"
          value={newRental.AgentID}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="OwnerID"
          placeholder="Owner ID"
          value={newRental.OwnerID}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="RentAmount"
          placeholder="Rent Amount"
          value={newRental.RentAmount}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="RentalStartDate"
          placeholder="Rental Start Date"
          value={newRental.RentalStartDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="RentalEndDate"
          placeholder="Rental End Date"
          value={newRental.RentalEndDate}
          onChange={handleChange}
        />
        <input
          type="number"
          name="MarketTime"
          placeholder="Market Time (days)"
          value={newRental.MarketTime}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Rental</button>
      </form>
      <h3>Rental List</h3>
      <ul>
        {rentals.map((rental) => (
          <li key={rental.RentalID}>
            Rental ID: {rental.RentalID} - Property ID: {rental.PropertyID} - Rent Amount: {rental.RentAmount}{' '}
            <button onClick={() => handleDeleteRental(rental.RentalID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rentals;
