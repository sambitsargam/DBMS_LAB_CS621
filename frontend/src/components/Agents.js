// src/components/Agents.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({ Name: '', Contact: '', Email: '' });
  const [editingAgent, setEditingAgent] = useState(null); // holds agent object if editing
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState('');

  // Fetch agents from the server
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

  // Handle input change for both add and edit forms
  const handleChange = (e, forEdit = false) => {
    if (forEdit) {
      setEditingAgent({ ...editingAgent, [e.target.name]: e.target.value });
    } else {
      setNewAgent({ ...newAgent, [e.target.name]: e.target.value });
    }
  };

  // Add new agent
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

  // Set an agent for editing
  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
  };

  // Update agent details via PUT
  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/agents/${editingAgent.AgentID}`, editingAgent, { withCredentials: true });
      setEditingAgent(null);
      fetchAgents();
    } catch (err) {
      setError('Failed to update agent');
    }
  };

  // Delete an agent
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

      {/* Form for Adding a New Agent (only when not editing) */}
      {!editingAgent && (
        <form onSubmit={handleAddAgent} className="mb-4">
          <div className="form-group mb-2">
            <input
              type="text"
              name="Name"
              className="form-control"
              placeholder="Agent Name"
              value={newAgent.Name}
              onChange={(e) => handleChange(e)}
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
              onChange={(e) => handleChange(e)}
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
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Agent</button>
        </form>
      )}

      {/* Form for Editing an Existing Agent */}
      {editingAgent && (
        <form onSubmit={handleUpdateAgent} className="mb-4">
          <h4>Editing Agent ID: {editingAgent.AgentID}</h4>
          <div className="form-group mb-2">
            <input
              type="text"
              name="Name"
              className="form-control"
              placeholder="Agent Name"
              value={editingAgent.Name}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="Contact"
              className="form-control"
              placeholder="Contact"
              value={editingAgent.Contact}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="email"
              name="Email"
              className="form-control"
              placeholder="Email"
              value={editingAgent.Email}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success me-2">Update Agent</button>
          <button type="button" onClick={() => setEditingAgent(null)} className="btn btn-secondary">Cancel</button>
        </form>
      )}

      {/* Filter Input */}
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
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditAgent(agent)}>Edit</button>
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
