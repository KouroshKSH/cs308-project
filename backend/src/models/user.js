const db = require("../config/database"); // MySQL connection pool

const userModel = {
  //  Find user by email (used for login and duplicate check)
  findByEmail: async (email) => {
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    return rows[0]; // Return the first matching user (or undefined)
  },

  // Create a new user in the database
  create: async ({ username, email, password, address, phone_number }) => {
    const [result] = await db.query(
      `INSERT INTO users (username, email, password_hash, address, phone_number)
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, password, address, phone_number]
    );
    return result; // Contains insertId and info
  },
};

module.exports = { userModel };
