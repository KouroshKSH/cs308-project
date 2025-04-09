const jwt = require("jsonwebtoken");

//  Middleware to verify JWT and extract user info
const authMiddleware = (req, res, next) => {
  // Get token from Authorization header: "Bearer <token>"
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1]; // Extract actual token
  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user data from token into request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token verification failed" });
  }
};

module.exports = authMiddleware;
