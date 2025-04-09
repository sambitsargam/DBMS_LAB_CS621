// src/components/RentalReport.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function RentalReport() {
  const [rentalReports, setRentalReports] = useState([]);
  const [filterText, setFilterText] = useState('');

  const fetchRentalReport = async () => {
    try {
      const res = await axios.get('http://localhost:3000/reports/rentals', { withCredentials: true });
      setRentalReports(res.data);
    } catch (err) {
      console.error('Error fetching rental report:', err);
    }
  };

  useEffect(() => {
    fetchRentalReport();
  }, []);

  // Filter by agent name or area
  const filteredReports = rentalReports.filter((report) => 
    report.AgentName.toLowerCase().includes(filterText.toLowerCase()) ||
    (report.Areas && report.Areas.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="container-box">
      <NavBar />
      <h2>Rental Report</h2>
      <input
        type="text"
        className="form-control filter-input"
        placeholder="Filter rental report..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <div className="table-container mt-3">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Agent Name</th>
              <th>Total Rentals</th>
              <th>Total Rent Amount</th>
              <th>Rental Dates</th>
              <th>Areas</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={index}>
                <td>{report.AgentID}</td>
                <td>{report.AgentName}</td>
                <td>{report.RentalCount}</td>
                <td>{report.TotalRent}</td>
                <td>{report.RentalDates}</td>
                <td>{report.Areas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RentalReport;
