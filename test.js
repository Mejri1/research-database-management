// server.js
const express = require('express'); // Import express
const cors = require('cors');       // Import cors for cross-origin requests
const { getAllChercheurs } = require('./my-research-database/db'); // Import the function from db.js

const app = express(); // Create an instance of express
const port = 5050;    // Set the port for the server

app.use(cors());      // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// Endpoint to get all chercheurs
app.get('/api/chercheurs', async (req, res) => {
    const chercheurs = await getAllChercheurs(); // Call the function to get chercheurs
    console.log('Fetched chercheurs:', chercheurs); // Log the results to the console
    res.json(chercheurs); // Send the results as a JSON response
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
