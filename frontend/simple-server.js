const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3015;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Serve static files
app.use(express.static(__dirname));

// Route for the main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'complete-app.html'));
});

// Catch-all route to serve the main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'complete-app.html'));
});

app.listen(PORT, () => {
  console.log(`CryptoFund Nexus server running on http://localhost:${PORT}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
});