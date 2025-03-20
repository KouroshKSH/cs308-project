const db = require('../config/database');
const bcrypt = require('bcrypt');

const userModel = {
    create: async (userData) => {
        const { username, email, password, role = 'customer', address, phone_number } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash, role, address, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, role, address, phone_number]
        );
        return result;
    },

    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0]; // Return the first user if found
    },
};

module.exports = { userModel };