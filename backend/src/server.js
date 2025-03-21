require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// All API endpoints are now prefixed with /api
// app.use('/api', routes);
app.use('/', routes);


// Simple health-check route
app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// // 1. Setting up the tools (i.e., libraries)

// // read the secrets from the `.env` file
// require("dotenv").config();

// // Express will handle things like receiving orders and sending responses
// const express = require("express");

// // CORS helps prevent unwanted visitors from interfering
// const cors = require("cors");

// // ---------------------------------------------------------

// // 2. Building the shop (i.e., app)

// // create the main structure of the shop using Express
// const app = express();

// const routes = require("./routes");

// // understand orders that are in JSON format
// app.use(express.json());

// // use the security guard "CORS" to control who can talk to it
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// app.use('/api', routes);

// // ---------------------------------------------------------

// // 3. a sample route for saying "hello"

// // create a simple sign that says "API is running..."
// app.get(
//     "/", // someone visited the main page (i.e., "/"), so do the following
//     (req, res) => res.send(
//         "API is running..." // the customer will see this message
//     )
//     // `req` is the customer's request, `res` is the shop's response
// );

// // ---------------------------------------------------------

// // 4. start the shop (i.e., open the server)

// const PORT = process.env.PORT || 5000; // defaults to 5000 if not specified

// // open the door and start receiving customers
// app.listen(
//     PORT, // listen for customers at the specified door
//     () => console.log( // write a message to the shop's log
//         `Server is running on port ${PORT}` // use backticks '`' to insert variables
//     )
// );