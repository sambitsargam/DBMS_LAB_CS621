import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({ Name: '', Contact: '', Email: '' });
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState('');

  const fetchAgents = async () => {
    try {
      const res = await axios.get('http://localhost:3000/agents', { withCredentials: true });
      setAgents(res.data);
    } catch (err) {
      console.error('Error fetching agents');
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleChange = (e) => {
    setNewAgent({ ...newAgent, [e.target.name]: e.target.value });
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/agents', newAgent, { withCredentials: true });
      setNewAgent({ Name: '', Contact: '', Email: '' });
      fetchAgents();
    } catch (err) {
      setError('Failed to add agent');
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/agents/${id}`, { withCredentials: true });
      fetchAgents();
    } catch (err) {
      console.error('Delete failed');
    }
  };

  // Filter agents by name (case insensitive)
  const filteredAgents = agents.filter((agent) =>
    agent.Name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container-box">
      <NavBar />
      <h2>Manage Agents</h2>
      {error && <p className="error">{error}</p>}
      
      {/* Form to add a new agent */}
      <form onSubmit={handleAddAgent} className="mb-4">
        <div className="form-group mb-2">
          <input
            type="text"
            name="Name"
            className="form-control"
            placeholder="Agent Name"
            value={newAgent.Name}
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
            value={newAgent.Contact}
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
            value={newAgent.Email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Agent</button>
      </form>
      
      {/* Filter input */}
      <input
        type="text"
        className="form-control filter-input"
        placeholder="Filter agents by name..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      
      {/* Animated Table */}
      <div className="table-container mt-3">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent) => (
              <tr key={agent.AgentID}>
                <td>{agent.AgentID}</td>
                <td>{agent.Name}</td>
                <td>{agent.Contact}</td>
                <td>{agent.Email}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAgent(agent.AgentID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Agents;
