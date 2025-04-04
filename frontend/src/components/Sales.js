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
  const [filterText, setFilterText] = useState('');
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

  const filteredSales = sales.filter((sale) =>
    sale.SaleDate.toString().toLowerCase().includes(filterText.toLowerCase()) ||
    sale.SalePrice.toString().toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container-box">
      <NavBar />
      <h2>Manage Sales Transactions</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleAddSale} className="mb-4">
        <div className="form-group mb-2">
          <input
            type="number"
            name="PropertyID"
            className="form-control"
            placeholder="Property ID"
            value={newSale.PropertyID}
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
            value={newSale.AgentID}
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
            value={newSale.OwnerID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="SalePrice"
            className="form-control"
            placeholder="Sale Price"
            value={newSale.SalePrice}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="date"
            name="SaleDate"
            className="form-control"
            placeholder="Sale Date"
            value={newSale.SaleDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            name="MarketTime"
            className="form-control"
            placeholder="Market Time (days)"
            value={newSale.MarketTime}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Sale</button>
      </form>
      
      <input
        type="text"
        className="form-control filter-input"
        placeholder="Filter by Sale Date or Price..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      
      <div className="table-container mt-3">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Sales ID</th>
              <th>Property ID</th>
              <th>Agent ID</th>
              <th>Owner ID</th>
              <th>Sale Price</th>
              <th>Sale Date</th>
              <th>Market Time (days)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.SalesID}>
                <td>{sale.SalesID}</td>
                <td>{sale.PropertyID}</td>
                <td>{sale.AgentID}</td>
                <td>{sale.OwnerID}</td>
                <td>{sale.SalePrice}</td>
                <td>{sale.SaleDate}</td>
                <td>{sale.MarketTime}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSale(sale.SalesID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sales;
