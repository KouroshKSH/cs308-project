// 1. Setting up the tools (i.e., libraries)

// read the secrets from the `.env` file
require("dotenv").config();

// Express will handle things like receiving orders and sending responses
const express = require("express");

// CORS helps prevent unwanted visitors from interfering
const cors = require("cors");

// ---------------------------------------------------------

// 2. Building the shop (i.e., app)

// create the main structure of the shop using Express
const app = express();

// understand orders that are in JSON format
app.use(express.json());

// use the security guard "CORS" to control who can talk to it
app.use(cors());

// ---------------------------------------------------------

// 3. a sample route for saying "hello"

// create a simple sign that says "API is running..."
app.get(
    "/", // someone visited the main page (i.e., "/"), so do the following
    (req, res) => res.send(
        "API is running..." // the customer will see this message
    )
    // `req` is the customer's request, `res` is the shop's response
);

// ---------------------------------------------------------

// 4. start the shop (i.e., open the server)

// decide which door (i.e., port number) to open for receiving customers
const PORT = process.env.PORT || 5000; // defaults to 5000 if not specified

// open the door and start receiving customers
app.listen(
    PORT, // listen for customers at the specified door
    () => console.log( // write a message to the shop's log
        `Server is running on port ${PORT}` // use backticks '`' to insert variables
    )
);