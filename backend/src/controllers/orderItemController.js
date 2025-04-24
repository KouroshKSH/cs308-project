const OrderItem = require('../models/orderItem');

exports.getItemsByOrder = async (req, res) => {
  try {
    const items = await OrderItem.getByOrderId(req.params.orderId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const { quantity, price_at_purchase } = req.body;
    await OrderItem.update(req.params.id, { quantity, price_at_purchase });
    res.json({ message: 'Order item updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
