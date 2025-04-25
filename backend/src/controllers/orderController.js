const Order = require('../models/order');
const OrderItem = require('../models/orderItem');

const pool = require("../config/database");

exports.createOrder = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { delivery_address, total_price, items } = req.body;

    if (!delivery_address || !total_price || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the order
    const orderId = await Order.create({ user_id, delivery_address, total_price });

    // Loop through the order items to create them and update stock
    await Promise.all(items.map(async item => {
      const { product_id, variation_id, quantity, price_at_purchase } = item;

      if (!product_id || !quantity || price_at_purchase == null) {
        throw new Error("Each order item must have product_id, quantity, and price_at_purchase");
      }

      // 1. Check stock quantity for the selected variation
      const [variationRows] = await pool.query(
        `SELECT variation_id, stock_quantity FROM product_variations WHERE variation_id = ?`,
        [variation_id]
      );

      if (variationRows.length === 0) {
        throw new Error("Variation not found");
      }

      const variation = variationRows[0];

      if (variation.stock_quantity < quantity) {
        throw new Error(`Not enough stock for variation ${variation_id}`);
      }

      // 2. Create the order item
      await OrderItem.create({ order_id: orderId, product_id, variation_id, quantity, price_at_purchase });

      // 3. Decrement stock
      const newStock = variation.stock_quantity - quantity;
      await pool.query(
        `UPDATE product_variations SET stock_quantity = ? WHERE variation_id = ?`,
        [newStock, variation_id]
      );
    }));

    res.status(201).json({ message: 'Order created successfully', order_id: orderId });
  } catch (err) {
    console.error("Order creation error:", err);
    const message = err.message.includes("Each order item") ? err.message : "Internal server error";
    res.status(err.message.includes("Each order item") ? 400 : 500).json({ error: message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authorization required" });
    }

    const userId = req.user.user_id;
    console.log("🔒 Fetching orders for user_id:", userId);

    const orders = await Order.getByUserId(userId);

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.getById(orderId);

    if (req.user && order.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "You are not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const order = await Order.getById(orderId);

    if (req.user && order.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "You are not authorized to update this order" });
    }

    await Order.updateStatus(orderId, status);
    res.json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.getById(orderId);

    if (req.user && order.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "You are not authorized to delete this order" });
    }

    await Order.delete(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
