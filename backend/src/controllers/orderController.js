const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Deliveries = require('../models/deliveries');
const Cart = require('../models/cart');
const Product = require('../models/product');

const pool = require("../config/database");

exports.createOrder = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { delivery_address, total_price, items } = req.body;

    if (!delivery_address || !total_price || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Creating order
    const orderId = await Order.create({ user_id, delivery_address, total_price });

    // create random tracking number that starts with "TRK" and is followed by date as yyyy-mm-dd-hh-mm-ss and 3 random digits to avoid duplicates
    const tracking_number = `TRK-${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}-${Math.floor(Math.random() * 1000)}`;

    // Creating delivery
    await Deliveries.create({
      order_id: orderId,
      delivery_status: 'pending',
      tracking_number: tracking_number,
      delivery_address: delivery_address
    });

    // Going through order items to create them and to update stock
    await Promise.all(items.map(async item => {
      const { product_id, variation_id, quantity, price_at_purchase } = item;

      if (!product_id || !quantity || price_at_purchase == null) {
        throw new Error("Each order item must have product_id, quantity, and price_at_purchase");
      }

      // Checking stock quantity for the selected variation
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

      // Creating the order item
      await OrderItem.create({ order_id: orderId, product_id, variation_id, quantity, price_at_purchase });

      // Decrementing stock
      const newStock = variation.stock_quantity - quantity;
      await pool.query(
        `UPDATE product_variations SET stock_quantity = ? WHERE variation_id = ?`,
        [newStock, variation_id]
      );
    }));

    // Deleting the cart items for the user
    await Cart.removeItemsAfterCheckout(
      user_id,
      items.map(item => ({
        product_id: item.product_id,
        variation_id: item.variation_id
      }))
    );

    // once the order is created, the stock is updated, and cart items are removed,
    // then we can create the order
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
    console.log("Fetching orders for user_id:", userId);

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

exports.getOrderWithItems = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.getById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user && order.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "You are not authorized to view this order" });
    }

    const items = await OrderItem.getByOrderId(orderId);

    const itemDetails = await Promise.all(items.map(async (item) => {
      const product = await Product.getProductById(item.product_id);
      return {
        ...item,
        product_name: product?.name || "Unknown Product",
      };
    }));

    res.json({ order, items: itemDetails });
  } catch (err) {
    console.error("Error fetching order with items:", err);
    res.status(500).json({ error: err.message });
  }
};  

exports.getProductSalesStats = async (req, res) => {
  try {
    if (req.user.role !== 'salesManager') {
      return res.status(403).json({ message: "Only sales managers can access product sales stats." });
    }

    const stats = await Order.getProductSalesStats();
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product sales stats" });
  }
};

exports.getVariationSalesStats = async (req, res) => {
  try {
    if (req.user.role !== 'salesManager') {
      return res.status(403).json({ message: "Only sales managers can access variation sales stats." });
    }

    const stats = await Order.getVariationSalesStats();
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch variation sales stats" });
  }
};

exports.getVariationSalesStatsByProduct = async (req, res) => {
  try {
    if (req.user.role !== 'salesManager') {
      return res.status(403).json({ message: "Only sales managers can access variation sales stats." });
    }

    const productId = req.params.productId;
    const stats = await Order.getVariationSalesStatsByProductId(productId);
    res.status(200).json(stats);
  } catch (err) {
    console.error("Variation stats error:", err);
    res.status(500).json({ error: "Failed to fetch variation stats for product" });
  }
};

exports.getDailyRevenueAndProfit  = async (req, res) => {
  try {
    if (req.user.role !== 'salesManager') {
      return res.status(403).json({ error: 'Access denied. Sales manager role required.' });
    }

    const data = await Order.getDailyRevenueAndProfit();

    const formattedData = data.map(item => ({
      ...item,
      date: new Date(item.date).toISOString().split('T')[0],
    }));

    res.status(200).json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch revenue and profit over time' });
  }
};

exports.getCumulativeRevenueAndProfit = async (req, res) => {
  try {
    if (req.user.role !== 'salesManager') {
      return res.status(403).json({ error: 'Access denied. Sales manager role required.' });
    }

    const dailyData = await Order.getDailyRevenueAndProfit();

    let cumulativeRevenue = 0;
    let cumulativeProfit = 0;

    const cumulativeData = dailyData.map(day => {
      cumulativeRevenue += parseFloat(day.total_revenue);
      cumulativeProfit += parseFloat(day.total_profit);
      return {
        date: new Date(day.date).toISOString().split('T')[0],
        cumulative_revenue: cumulativeRevenue,
        cumulative_profit: cumulativeProfit,
      };
    });

    res.status(200).json(cumulativeData);
  } catch (error) {
    console.error('Error fetching cumulative revenue and profit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCumulativeRevenueAndProfitBetweenDates = async (req, res) => {
  try {
    if (req.user.role !== 'salesManager') {
      return res.status(403).json({ error: 'Access denied. Sales manager role required.' });
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const dailyData = await Order.getDailyRevenueAndProfitBetweenDates(startDate, endDate);

    let cumulativeRevenue = 0;
    let cumulativeProfit = 0;

    const cumulativeData = dailyData.map(day => {
      cumulativeRevenue += parseFloat(day.total_revenue);
      cumulativeProfit += parseFloat(day.total_profit);
      return {
        date: new Date(day.date).toISOString().split('T')[0],
        cumulative_revenue: cumulativeRevenue,
        cumulative_profit: cumulativeProfit,
      };
    });

    res.status(200).json(cumulativeData);
  } catch (error) {
    console.error('Error fetching cumulative stats for date range:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDailyRevenueAndProfitBetweenDates = async (req, res) => {
  if (!req.user || req.user.role !== 'salesManager') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate query parameters are required' });
  }
  try {
    const stats = await Order.getDailyRevenueAndProfitBetweenDates(startDate, endDate);

    const formattedStats = stats.map(item => ({
      ...item,
      date: new Date(item.date).toISOString().split('T')[0],
    }));

    res.json(formattedStats);
  } catch (error) {
    console.error('Error getting daily revenue and profit between dates:', error);
    res.status(500).json({ error: 'Failed to get daily revenue and profit between dates' });
  }
};