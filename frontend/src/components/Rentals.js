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
  const [filterText, setFilterText] = useState('');
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

  const filteredRentals = rentals.filter((rental) =>
    rental.RentalStartDate.toLowerCase().includes(filterText.toLowerCase()) ||
    rental.RentAmount.toString().toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container-box">
      <NavBar />
      <h2>Manage Rental Transactions</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleAddRental} className="mb-4">
        <div className="form-group mb-2">
          <input
            type="number"
            name="PropertyID"
            className="form-control"
            placeholder="Property ID"
            value={newRental.PropertyID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="AgentID"
            className="form-control"
            placeholder="Agent ID"
            value={newRental.AgentID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="OwnerID"
            className="form-control"
            placeholder="Owner ID"
            value={newRental.OwnerID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="RentAmount"
            className="form-control"
            placeholder="Rent Amount"
            value={newRental.RentAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="date"
            name="RentalStartDate"
            className="form-control"
            placeholder="Rental Start Date"
            value={newRental.RentalStartDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="date"
            name="RentalEndDate"
            className="form-control"
            placeholder="Rental End Date"
            value={newRental.RentalEndDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="MarketTime"
            className="form-control"
            placeholder="Market Time (days)"
            value={newRental.MarketTime}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Rental</button>
      </form>
      
      <input
        type="text"
        className="form-control filter-input"
        placeholder="Filter by Rental Start Date or Rent Amount..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      
      <div className="table-container mt-3">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Rental ID</th>
              <th>Property ID</th>
              <th>Agent ID</th>
              <th>Owner ID</th>
              <th>Rent Amount</th>
              <th>Rental Start</th>
              <th>Rental End</th>
              <th>Market Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRentals.map((rental) => (
              <tr key={rental.RentalID}>
                <td>{rental.RentalID}</td>
                <td>{rental.PropertyID}</td>
                <td>{rental.AgentID}</td>
                <td>{rental.OwnerID}</td>
                <td>{rental.RentAmount}</td>
                <td>{rental.RentalStartDate}</td>
                <td>{rental.RentalEndDate || 'Ongoing'}</td>
                <td>{rental.MarketTime}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRental(rental.RentalID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Rentals;
