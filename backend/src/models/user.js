const db = require("../config/database");
const bcrypt = require("bcrypt");

const userModel = {
  // Creates a new user in the database
  create: async (userData) => {
    const {
      username,
      email,
      password,
      role = "customer",
      address,
      phone_number,
    } = userData;

    // Hash the user's password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database with the hashed password
    const [result] = await db.execute(
      `INSERT INTO users (username, email, password_hash, role, address, phone_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        username,
        email,
        hashedPassword,
        role,
        address || null,
        phone_number || null,
      ]
    );

    return result;
  },

  // Finds a user by their email address
  findByEmail: async (email) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },
};

module.exports = { userModel };
