const Order = require('../models/order');
const OrderItem = require('../models/orderItem');

exports.createOrder = async (req, res) => {
  try {
    const { user_id, delivery_address, total_price, items } = req.body;
    const orderId = await Order.create({ user_id, delivery_address, total_price });
    await Promise.all(items.map(item => OrderItem.create({ order_id: orderId, ...item })));
    res.status(201).json({ message: 'Order created successfully', order_id: orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.getByUserId(req.params.userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.updateStatus(req.params.id, status);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.delete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
