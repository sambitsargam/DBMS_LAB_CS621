import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({ Name: '', Contact: '', Email: '' });
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

  return (
    <div className="agents-container">
      <NavBar />
      <h2>Manage Agents</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddAgent}>
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={newAgent.Name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Contact"
          placeholder="Contact"
          value={newAgent.Contact}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={newAgent.Email}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Agent</button>
      </form>
      <h3>Agent List</h3>
      <ul>
        {agents.map((agent) => (
          <li key={agent.AgentID}>
            {agent.Name} - {agent.Email} - {agent.Contact}{' '}
            <button onClick={() => handleDeleteAgent(agent.AgentID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Agents;
