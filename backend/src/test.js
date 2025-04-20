const express = require("express");
const app = express();

app.use(express.json()); // important!

app.post("/test", (req, res) => {
  console.log("BODY RECEIVED:", req.body);
  res.json({ received: req.body });
});

app.listen(5000, () => console.log("Server running on port 5000"));
