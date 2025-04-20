const jwt = require("jsonwebtoken");

// middleware to optionally verify JWT and extract user info
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // actual token
    console.log("Token:", token);
    if (token) {
      try {
        // verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // we can save user data from token into request object for later
        req.user = decoded;
        console.log("Decoded user info:", req.user);
      } catch (err) {
        console.error("Token verification failed:", err.message);
        // do NOT block the request; just proceed without user info
      }
    } else {
        console.error("No token found in authorization header");
    }
    console.log("Authorization header:", authHeader);
  }

  next();
};

module.exports = optionalAuthMiddleware;