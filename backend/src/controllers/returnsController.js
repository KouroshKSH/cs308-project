const Returns = require('../models/returns');
const ProductVariations = require('../models/productVariations');
const Order = require('../models/order');
const db = require('../config/database');
const { sendOrderConfirmation, sendRefundConfirmation } = require('../mailer');
const { generateInvoicePdf } = require('../invoicePdfGenerator');

exports.createReturn = async (req, res) => {
  try {
    const userId = req.user.user_id;
    // Removed refund_amount from req.body as it will be pulled from the order
    const { order_id } = req.body;
    // no more order_item_id and quantity in the returns table

    if (!order_id) {
      return res.status(400).json({ message: "order_id is required" });
    }

    // 1. Fetch the order details
    const order = await Order.getById(order_id);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Ensure the user owns the order (security check)
    if (order.user_id !== userId) {
      return res.status(403).json({ message: "You are not authorized to create a return for this order." });
    }

    // 2. Check order status: Must be 'delivered'
    if (order.status.toLowerCase() !== 'delivered') {
      return res.status(400).json({ message: `Return requests can only be made for 'delivered' orders. Current status: ${order.status}.` });
    }

    // 3. Check time limit: Less than 30 days since order_date
    const orderDate = new Date(order.order_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (orderDate < thirtyDaysAgo) {
      return res.status(400).json({ message: "Return requests can only be made within 30 days of the order date." });
    }

    const [existingReturns] = await db.execute(
      `SELECT return_id, status FROM returns WHERE order_id = ?`,
      [order_id]
    );

    // If any return request exists for this order, prevent a new request.
    if (existingReturns.length > 0) {
      return res.status(400).json({ message: `A return request for this order already exists with status: ${existingReturns[0].status}.` });
    }

    // Use the total_price from the fetched order as the refund_amount
    const refund_amount = order.total_price;

    // If all checks pass, proceed with creating the return request
    const returnId = await Returns.create({
      order_id,
      refund_amount, // Now using the total_price from the order
      user_id: userId
    });

    res.status(201).json({ message: "Return request created successfully", return_id: returnId });
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
