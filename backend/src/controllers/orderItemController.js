const OrderItem = require("../models/orderItem");
const Order = require("../models/order");

exports.getItemsByOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.getById(orderId);

    if (req.user && order.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "You are not authorized to view these items" });
    }

    const items = await OrderItem.getByOrderId(orderId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const { quantity, price_at_purchase } = req.body;
    const orderItemId = req.params.id;

    const orderItem = await OrderItem.getById(orderItemId);
    const order = await Order.getById(orderItem.order_id);

    if (req.user && order.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "You are not authorized to update this order item" });
    }

    await OrderItem.update(orderItemId, { quantity, price_at_purchase });
    res.json({ message: "Order item updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
