// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware */
// Configure express to use body-parser as middle-ware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});

// POST route
app.post('/add', (req, res) => {
    const { temperature, date, userResponse } = req.body;
    projectData = {
        temperature,
        date,
        userResponse
    };
    res.send({ message: "Data added successfully", projectData });
});

// GET route
app.get('/data', (req, res) => {
    res.send(projectData);
});
