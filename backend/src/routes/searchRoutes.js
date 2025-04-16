const express = require("express");
const router = express.Router();
const { connection } = require("../db_connection");

router.get("/:query", (req, res) => {
    const searchTerm = req.params.query;
    const like = `%${searchTerm}%`;

    const sql = `
        SELECT product_id, name AS name, description AS description, price AS price
        FROM products
        WHERE name LIKE ? OR description LIKE ?
        LIMIT 3;
    `;

    connection.query(sql, [like, like], (err, results) => {
        if (err) {
            console.error("Search query error:", err.message);
            return res.status(500).json({ error: "Search failed" });
        }

        res.json(results);
    });
});

module.exports = router;
