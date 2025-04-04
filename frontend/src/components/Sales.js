import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function Sales() {
  const [sales, setSales] = useState([]);
  const [newSale, setNewSale] = useState({
    PropertyID: '',
    AgentID: '',
    OwnerID: '',
    SalePrice: '',
    SaleDate: '',
    MarketTime: ''
  });
  const [error, setError] = useState('');

  const fetchSales = async () => {
    try {
      const res = await axios.get('http://localhost:3000/sales', { withCredentials: true });
      setSales(res.data);
    } catch (err) {
      console.error('Error fetching sales');
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleChange = (e) => {
    setNewSale({ ...newSale, [e.target.name]: e.target.value });
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/sales', newSale, { withCredentials: true });
      setNewSale({
        PropertyID: '',
        AgentID: '',
        OwnerID: '',
        SalePrice: '',
        SaleDate: '',
        MarketTime: ''
      });
      fetchSales();
    } catch (err) {
      setError('Failed to add sale transaction');
    }
  };

  const handleDeleteSale = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/sales/${id}`, { withCredentials: true });
      fetchSales();
    } catch (err) {
      console.error('Delete failed');
    }
  };

  return (
    <div className="sales-container">
      <NavBar />
      <h2>Manage Sales Transactions</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddSale}>
        <input
          type="number"
          name="PropertyID"
          placeholder="Property ID"
          value={newSale.PropertyID}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="AgentID"
          placeholder="Agent ID"
          value={newSale.AgentID}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="OwnerID"
          placeholder="Owner ID"
          value={newSale.OwnerID}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="SalePrice"
          placeholder="Sale Price"
          value={newSale.SalePrice}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="SaleDate"
          placeholder="Sale Date"
          value={newSale.SaleDate}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="MarketTime"
          placeholder="Market Time (days)"
          value={newSale.MarketTime}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Sale</button>
      </form>
      <h3>Sales List</h3>
      <ul>
        {sales.map((sale) => (
          <li key={sale.SalesID}>
            Sale ID: {sale.SalesID} - Property ID: {sale.PropertyID} - Sale Price: {sale.SalePrice}{' '}
            <button onClick={() => handleDeleteSale(sale.SalesID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sales;
