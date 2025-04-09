// app.js

const express = require('express');
const mysql = require('mysql2/promise');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3003', // or use "*" to allow all origins (not recommended for prod)
    credentials: true // if you're using cookies/sessions
  }));

// Configure session middleware
app.use(session({
  secret: '282e67590f603e0faad6a99e25e2ee32b222be381dd0ac1605c6dbed1b295f72427bae54110da5d1558dedcf142fe9adfedb85f2924952e01f11c689dd5ee4e8', // replace with a secure secret key
  resave: false,
  saveUninitialized: false
}));

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'newpassword',
  database: 'newdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware to ensure an agent is logged in
function isAgentAuthenticated(req, res, next) {
  if (req.session && req.session.agent) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized: Please login as agent' });
}

// =====================
// Agent Login & Logout
// =====================

// Agent login uses email and contact as the password
app.post('/agent/login', async (req, res) => {
  const { email, contact } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM Agent WHERE Email = ?', [email]);
    if (rows.length > 0) {
      const agent = rows[0];
      // For our agent system, we use the contact field as the “password”
      if (agent.Contact === contact) {
        req.session.agent = { AgentID: agent.AgentID, Email: agent.Email, Name: agent.Name };
        return res.json({ message: 'Agent login successful', agent: req.session.agent });
      }
    }
    return res.status(401).json({ message: 'Invalid login credentials' });
  } catch (error) {
    console.error('Error during agent login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Agent logout
app.post('/agent/logout', isAgentAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Agent logged out successfully' });
  });
});

// =============================
// Agent-Only Endpoints
// =============================

// (1) Get properties assigned to the agent.
// We assume that the Property table has an "AssignedAgentID" column.
app.get('/agent/properties', isAgentAuthenticated, async (req, res) => {
  const agentID = req.session.agent.AgentID;
  try {
    const [rows] = await pool.query('SELECT * FROM Property WHERE AssignedAgentID = ?', [agentID]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching properties for agent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// (2) Get details for a specific property that is assigned to the agent
app.get('/agent/property/:id', isAgentAuthenticated, async (req, res) => {
  const { id } = req.params;
  const agentID = req.session.agent.AgentID;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Property WHERE PropertyID = ? AND AssignedAgentID = ?',
      [id, agentID]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Property not found or not assigned to you' });
    }
  } catch (error) {
    console.error('Error fetching property details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// (3) Update property status (e.g., mark as sold or rented)
// We expect a JSON payload { status: "sold" } or { status: "rented" }.
app.put('/agent/property/:id/status', isAgentAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 
  const agentID = req.session.agent.AgentID;
  try {
    if (status !== 'sold' && status !== 'rented') {
      return res.status(400).json({ message: 'Invalid status. Must be "sold" or "rented".' });
    }

    // Update the property status accordingly.
    let updateQuery = '';
    if (status === 'sold') {
      updateQuery = 'UPDATE Property SET IsAvailableForSale = false WHERE PropertyID = ? AND AssignedAgentID = ?';
    } else if (status === 'rented') {
      updateQuery = 'UPDATE Property SET IsAvailableForRent = false WHERE PropertyID = ? AND AssignedAgentID = ?';
    }

    const [result] = await pool.query(updateQuery, [id, agentID]);
    if (result.affectedRows > 0) {
      res.json({ message: `Property marked as ${status}` });
    } else {
      res.status(404).json({ message: 'Property not found or not assigned to you' });
    }
  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// =====================
// Start the Agent Server
// =====================

const AGENT_PORT = process.env.AGENT_PORT || 3002;
app.listen(AGENT_PORT, () => {
  console.log(`Agent backend server running on port ${AGENT_PORT}`);
});
