import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error('Logout failed');
    }
  };

  return (
    <div className="container-box">
      <NavBar />
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard. Use the navigation links above to manage your data.</p>
      <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
    </div>
  );
}

export default Dashboard;
