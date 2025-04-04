// app.js

const express = require('express');
const mysql = require('mysql2/promise');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

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

// Middleware to check if the admin is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized. Please log in.' });
}

// ----------------------
// Admin Login and Logout
// ----------------------

// Admin login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM Admin WHERE Username = ?', [username]);
    if (rows.length > 0) {
      const admin = rows[0];
      // For simplicity, we are using plain text passwords.
      // In production, use hashed passwords and a library like bcrypt.
      if (admin.Password === password) {
        req.session.admin = { AdminID: admin.AdminID, Username: admin.Username };
        return res.json({ message: 'Login successful' });
      }
    }
    return res.status(401).json({ message: 'Invalid username or password' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin logout endpoint
app.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// ----------------------
// Endpoints for Managing Agents
// ----------------------

// Get all agents
app.get('/agents', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Agent');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new agent
app.post('/agents', isAuthenticated, async (req, res) => {
  const { Name, Contact, Email } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Agent (Name, Contact, Email) VALUES (?, ?, ?)',
      [Name, Contact, Email]
    );
    res.json({ message: 'Agent added successfully', AgentID: result.insertId });
  } catch (error) {
    console.error('Error adding agent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an agent
app.delete('/agents/:id', isAuthenticated, async (req, res) => {
  const agentId = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM Agent WHERE AgentID = ?', [agentId]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Agent deleted successfully' });
    } else {
      res.status(404).json({ message: 'Agent not found' });
    }
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------------
// Endpoints for Managing Owners
// ----------------------

// Get all owners
app.get('/owners', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Owner');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching owners:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new owner
app.post('/owners', isAuthenticated, async (req, res) => {
  const { Name, Contact, Email } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Owner (Name, Contact, Email) VALUES (?, ?, ?)',
      [Name, Contact, Email]
    );
    res.json({ message: 'Owner added successfully', OwnerID: result.insertId });
  } catch (error) {
    console.error('Error adding owner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an owner
app.delete('/owners/:id', isAuthenticated, async (req, res) => {
  const ownerId = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM Owner WHERE OwnerID = ?', [ownerId]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Owner deleted successfully' });
    } else {
      res.status(404).json({ message: 'Owner not found' });
    }
  } catch (error) {
    console.error('Error deleting owner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------------
// Endpoints for Managing Properties
// ----------------------

// Get all properties
app.get('/properties', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Property');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new property
app.post('/properties', isAuthenticated, async (req, res) => {
  const { OwnerID, Address, City, Locality, Size_sqft, Bedrooms, YearOfConstruction, SellingPrice, RentAmount, IsAvailableForSale, IsAvailableForRent } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO Property 
       (OwnerID, Address, City, Locality, Size_sqft, Bedrooms, YearOfConstruction, SellingPrice, RentAmount, IsAvailableForSale, IsAvailableForRent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [OwnerID, Address, City, Locality, Size_sqft, Bedrooms, YearOfConstruction, SellingPrice, RentAmount, IsAvailableForSale, IsAvailableForRent]
    );
    res.json({ message: 'Property added successfully', PropertyID: result.insertId });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a property
app.delete('/properties/:id', isAuthenticated, async (req, res) => {
  const propertyId = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM Property WHERE PropertyID = ?', [propertyId]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Property deleted successfully' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------------
// Endpoints for Managing Sales Transactions
// ----------------------

// Get all sales transactions
app.get('/sales', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sales');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new sale transaction
app.post('/sales', isAuthenticated, async (req, res) => {
  const { PropertyID, AgentID, OwnerID, SalePrice, SaleDate, MarketTime } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Sales (PropertyID, AgentID, OwnerID, SalePrice, SaleDate, MarketTime) VALUES (?, ?, ?, ?, ?, ?)',
      [PropertyID, AgentID, OwnerID, SalePrice, SaleDate, MarketTime]
    );
    res.json({ message: 'Sale transaction added successfully', SalesID: result.insertId });
  } catch (error) {
    console.error('Error adding sale:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a sale transaction
app.delete('/sales/:id', isAuthenticated, async (req, res) => {
  const salesId = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM Sales WHERE SalesID = ?', [salesId]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Sale transaction deleted successfully' });
    } else {
      res.status(404).json({ message: 'Sale transaction not found' });
    }
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------------
// Endpoints for Managing Rental Transactions
// ----------------------

// Get all rental transactions
app.get('/rentals', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Rental');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new rental transaction
app.post('/rentals', isAuthenticated, async (req, res) => {
  const { PropertyID, AgentID, OwnerID, RentAmount, RentalStartDate, RentalEndDate, MarketTime } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Rental (PropertyID, AgentID, OwnerID, RentAmount, RentalStartDate, RentalEndDate, MarketTime) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [PropertyID, AgentID, OwnerID, RentAmount, RentalStartDate, RentalEndDate, MarketTime]
    );
    res.json({ message: 'Rental transaction added successfully', RentalID: result.insertId });
  } catch (error) {
    console.error('Error adding rental:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a rental transaction
app.delete('/rentals/:id', isAuthenticated, async (req, res) => {
  const rentalId = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM Rental WHERE RentalID = ?', [rentalId]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Rental transaction deleted successfully' });
    } else {
      res.status(404).json({ message: 'Rental transaction not found' });
    }
  } catch (error) {
    console.error('Error deleting rental:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------------
// Start the Server
// ----------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
