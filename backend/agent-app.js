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


// Middleware to check agent authentication
function isAgentAuthenticated(req, res, next) {
  if (req.session && req.session.agent) return next();
  return res.status(401).json({ message: 'Not logged in' });
}

// Agent login
app.post('/agent/login', async (req, res) => {
  const { email, contact } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM Agent WHERE Email = ?', [email]);
    if (rows.length && rows[0].Contact === contact) {
      req.session.agent = { AgentID: rows[0].AgentID, Name: rows[0].Name, Email: rows[0].Email };
      res.json({ message: 'Login successful', agent: req.session.agent });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login error' });
  }
});

// Agent logout
app.post('/agent/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

// Get all properties assigned to this agent
app.get('/agent/properties', isAgentAuthenticated, async (req, res) => {
  const agentId = req.session.agent.AgentID;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Property WHERE AssignedAgentID = ?', [agentId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

// Mark a property as sold or rented
app.post('/agent/property/:id/mark', isAgentAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { status, marketTime } = req.body;
  const agentId = req.session.agent.AgentID;

  try {
    const [properties] = await pool.query(
      'SELECT * FROM Property WHERE PropertyID = ? AND AssignedAgentID = ?', [id, agentId]
    );
    if (!properties.length) {
      return res.status(404).json({ message: 'Property not found or not assigned to you' });
    }

    const property = properties[0];

    if (status === 'sold' && property.IsAvailableForSale) {
      await pool.query('UPDATE Property SET IsAvailableForSale = false WHERE PropertyID = ?', [id]);

      await pool.query(
        `INSERT INTO Sales (PropertyID, AgentID, OwnerID, SalePrice, SaleDate, MarketTime)
         VALUES (?, ?, ?, ?, NOW(), ?)`,
        [id, agentId, property.OwnerID, property.SellingPrice, marketTime]
      );

      return res.json({ message: 'Property marked as sold.' });
    }

    if (status === 'rented' && property.IsAvailableForRent) {
      await pool.query('UPDATE Property SET IsAvailableForRent = false WHERE PropertyID = ?', [id]);

      await pool.query(
        `INSERT INTO Rental (PropertyID, AgentID, OwnerID, RentAmount, RentalStartDate, MarketTime)
         VALUES (?, ?, ?, ?, NOW(), ?)`,
        [id, agentId, property.OwnerID, property.RentAmount, marketTime]
      );

      return res.json({ message: 'Property marked as rented.' });
    }

    res.status(400).json({ message: 'Invalid operation or already updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating property status' });
  }
});

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Agent backend running on http://localhost:${PORT}`);
});