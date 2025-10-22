const express = require('express');
const app = express();
const port = 3000;

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Hello from the app!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
