const { userModel } = require("../models/user");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // Extract user ID from the token

    // Fetch user info from the database
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return only the required fields
    const { username, email, address, phone_number } = user;
    res.status(200).json({ username, email, address, phone_number });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};