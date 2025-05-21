const Returns = require('../models/returns');
const ProductVariations = require('../models/productVariations');
const db = require('../config/database');

exports.createReturn = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { order_id, refund_amount } = req.body;
    // no more order_item_id and quantity in the returns table

    if (!order_id) {
      return res.status(400).json({ message: "order_id is required" });
    }

    const returnId = await Returns.create({
      order_id,
      refund_amount,
      user_id: userId
    });

    res.status(201).json({ message: "Return request created", return_id: returnId });
  } catch (err) {
    console.error("Create return failed:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getAllReturns = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const role = req.user.role;
    const { status } = req.query; // if sales manager wants to filter by status

    let returns;
    if (role === 'salesManager') {
      if (status) {
        returns = await Returns.getByStatus(status); // Filtered
      } else {
        returns = await Returns.getAll(); // All
      }
    } else {
      returns = await Returns.getByUserId(userId);
    }

    res.json(returns);
  } catch (err) {
    console.error("Fetch returns failed:", err);
    res.status(500).json({ error: err.message });
  }
};

// exports.updateReturnStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (req.user.role !== 'salesManager') {
//       return res.status(403).json({ message: "Only sales managers can approve or reject returns." });
//     }

//     await Returns.updateStatus(req.params.id, status);
//     res.json({ message: "Return status updated" });
//   } catch (err) {
//     console.error("Update return status failed:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

exports.updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const returnId = req.params.id;

    if (req.user.role !== 'salesManager') {
      return res.status(403).json({ message: "Only sales managers can approve or reject returns." });
    }

    // Get the return request to find the order_id
    const [[ret]] = await db.execute("SELECT * FROM returns WHERE return_id = ?", [returnId]);
    if (!ret) return res.status(404).json({ message: "Return request not found" });

    // If approving, update stock and order status
    if (status === 'approved') {
      // Get all order items for this order
      const [orderItems] = await db.execute(
        "SELECT variation_id, quantity FROM order_items WHERE order_id = ?",
        [ret.order_id]
      );
      // For each item, increase stock
      for (const item of orderItems) {
        if (item.variation_id && item.quantity) {
          await ProductVariations.increaseStock(item.variation_id, item.quantity);
        }
      }
      // Update order status to refunded
      await db.execute(
        "UPDATE orders SET status = 'refunded' WHERE order_id = ?",
        [ret.order_id]
      );
    }

    // If rejected, do NOT change order status (remains delivered)

    // Update return status
    await Returns.updateStatus(returnId, status);

    res.json({ message: "Return status updated" });
  } catch (err) {
    console.error("Update return status failed:", err);
    res.status(500).json({ error: err.message });
  }
};
