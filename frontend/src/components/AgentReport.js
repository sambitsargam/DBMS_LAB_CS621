// src/components/AgentReport.js
import React, { useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function AgentReport() {
  const [agentId, setAgentId] = useState('');
  const [report, setReport] = useState({ sales: [], rentals: [] });
  const [salesFilter, setSalesFilter] = useState('');
  const [rentalsFilter, setRentalsFilter] = useState('');
  const [error, setError] = useState('');

  const fetchAgentReport = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/reports/agent/${agentId}`, { withCredentials: true });
      setReport(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching agent report:', err);
      setError('Unable to fetch report. Please ensure the agent ID is valid.');
      setReport({ sales: [], rentals: [] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agentId.trim()) {
      fetchAgentReport();
    }
  };

  // Filter sales by property address, city or locality
  const filteredSales = report.sales.filter((sale) =>
    sale.Address.toLowerCase().includes(salesFilter.toLowerCase()) ||
    sale.City.toLowerCase().includes(salesFilter.toLowerCase()) ||
    sale.Locality.toLowerCase().includes(salesFilter.toLowerCase())
  );

  // Filter rentals by property address, city or locality
  const filteredRentals = report.rentals.filter((rental) =>
    rental.Address.toLowerCase().includes(rentalsFilter.toLowerCase()) ||
    rental.City.toLowerCase().includes(rentalsFilter.toLowerCase()) ||
    rental.Locality.toLowerCase().includes(rentalsFilter.toLowerCase())
  );

  return (
    <div className="container-box">
      <NavBar />
      <h2>Agent Full Report</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Agent ID"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Fetch Report</button>
      </form>
      {error && <p className="error">{error}</p>}

      {/* Sales Report Section */}
      <h3>Sales Report for Agent {agentId}</h3>
      <input
        type="text"
        className="form-control filter-input"
        placeholder="Filter sales by address, city, locality..."
        value={salesFilter}
        onChange={(e) => setSalesFilter(e.target.value)}
      />
      <div className="table-container mt-3">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Sale Date</th>
              <th>Sale Price</th>
              <th>Property ID</th>
              <th>Address</th>
              <th>City</th>
              <th>Locality</th>
              <th>Bedrooms</th>
              <th>Size (sqft)</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.SaleDate}</td>
                  <td>{sale.SalePrice}</td>
                  <td>{sale.PropertyID}</td>
                  <td>{sale.Address}</td>
                  <td>{sale.City}</td>
                  <td>{sale.Locality}</td>
                  <td>{sale.Bedrooms}</td>
                  <td>{sale.Size_sqft}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No sales found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rental Report Section */}
      <h3 className="mt-4">Rental Report for Agent {agentId}</h3>
      <input
        type="text"
        className="form-control filter-input"
        placeholder="Filter rentals by address, city, locality..."
        value={rentalsFilter}
        onChange={(e) => setRentalsFilter(e.target.value)}
      />
      <div className="table-container mt-3">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Rental Start Date</th>
              <th>Rent Amount</th>
              <th>Market Time</th>
              <th>Property ID</th>
              <th>Address</th>
              <th>City</th>
              <th>Locality</th>
              <th>Bedrooms</th>
            </tr>
          </thead>
          <tbody>
            {filteredRentals.length > 0 ? (
              filteredRentals.map((rental, index) => (
                <tr key={index}>
                  <td>{rental.RentalStartDate}</td>
                  <td>{rental.RentAmount}</td>
                  <td>{rental.MarketTime}</td>
                  <td>{rental.PropertyID}</td>
                  <td>{rental.Address}</td>
                  <td>{rental.City}</td>
                  <td>{rental.Locality}</td>
                  <td>{rental.Bedrooms}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No rental transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgentReport;
