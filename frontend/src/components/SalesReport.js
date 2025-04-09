// src/components/SalesReport.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function SalesReport() {
  const [sales, setSales] = useState([]);
  const [filterText, setFilterText] = useState('');

  const fetchSalesReport = async () => {
    try {
      const res = await axios.get('http://localhost:3000/reports/sales', { withCredentials: true });
      setSales(res.data);
    } catch (err) {
      console.error('Error fetching sales report:', err);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, []);

  // Filter report by agent name, address, city or locality
  const filteredSales = sales.filter((sale) => 
    sale.AgentName.toLowerCase().includes(filterText.toLowerCase()) ||
    sale.Address.toLowerCase().includes(filterText.toLowerCase()) ||
    sale.City.toLowerCase().includes(filterText.toLowerCase()) ||
    sale.Locality.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container-box">
      <NavBar />
      <h2>Sales Report</h2>
      <input
        type="text"
        className="form-control filter-input"
        placeholder="Filter sales report..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <div className="table-container mt-3">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Agent Name</th>
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
            {filteredSales.map((sale, index) => (
              <tr key={index}>
                <td>{sale.AgentID}</td>
                <td>{sale.AgentName}</td>
                <td>{sale.SaleDate}</td>
                <td>{sale.SalePrice}</td>
                <td>{sale.PropertyID}</td>
                <td>{sale.Address}</td>
                <td>{sale.City}</td>
                <td>{sale.Locality}</td>
                <td>{sale.Bedrooms}</td>
                <td>{sale.Size_sqft}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesReport;
