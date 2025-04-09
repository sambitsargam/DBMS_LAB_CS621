// src/components/AgentLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AgentLogin() {
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3002/agent/login', { email, contact }, { withCredentials: true });
      if (res.data.message === 'Agent login successful') {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="container-box">
      <h2>Agent Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group mb-2">
          <label>Contact (Password):</label>
          <input type="password" className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default AgentLogin;
