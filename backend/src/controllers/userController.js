const { userModel } = require("../models/user");
const Order = require("../models/order");

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        console.log("Fetching profile for user_id:", userId);  // Log userId from the token
    
        // Fetch user details from the database using the getById method
        const user = await userModel.getById(userId);  // Corrected from User.getById to userModel.getById
    
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }
    
        console.log("Fetched user:", user);  // Log the fetched user data
    
        // Fetch user orders
        const orders = await Order.getByUserId(userId);
        console.log("Fetched orders:", orders);  // Log the fetched orders
    
        res.json({ user, orders });
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ error: err.message });
    }
};