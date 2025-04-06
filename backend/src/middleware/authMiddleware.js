const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Retrieve the Authorization header from the request
  const authHeader = req.headers["authorization"];

  // If no token is provided, return 401 Unauthorized
  if (!authHeader) return res.status(401).json({ error: "No token" }); // "Token missing"

  // Extract the token from the "Bearer <token>" format
  const token = authHeader.split(" ")[1];

  // If token is not present or malformed, return 401 Unauthorized
  if (!token) return res.status(401).json({ error: "Invalid token" }); // "Invalid token"

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If verification fails, return 403 Forbidden
    res.status(403).json({ error: "Token couldn't verified" }); // "Token could not be verified"
  }
};

module.exports = authMiddleware;
