const Deliveries = require('../models/deliveries');

exports.createDelivery = async (req, res) => {
  try {
    const { order_id, shipped_date, delivery_status } = req.body;
    const deliveryId = await Deliveries.create({ order_id, shipped_date, delivery_status });
    res.status(201).json({ message: 'Delivery created', delivery_id: deliveryId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Deliveries.getAll();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDeliveryByOrder = async (req, res) => {
  try {
    const delivery = await Deliveries.getByOrderId(req.params.orderId);
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { delivery_status } = req.body;
    await Deliveries.updateStatus(req.params.id, delivery_status);
    res.json({ message: 'Delivery status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};