const Deliveries = require('../models/deliveries');

exports.createDelivery = async (req, res) => {
    const { order_id, delivery_status, tracking_number } = req.body;
  
    try {
      const id = await Deliveries.create({
        order_id,
        delivery_status,
        tracking_number
      });
  
      res.status(201).json({
        message: "Delivery created",
        delivery_id: id
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.getAllDeliveries = async (req, res) => {
    try {
      if (req.user.role !== 'productManager') {
        return res.status(403).json({ message: "Only product managers can view deliveries." });
      }
  
      const deliveries = await Deliveries.getAll();
      res.json(deliveries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.getDeliveryByOrder = async (req, res) => {
    try {
      if (req.user.role !== 'productManager') {
        return res.status(403).json({ message: "Only product managers can view delivery details." });
      }
  
      const delivery = await Deliveries.getByOrderId(req.params.orderId);
      res.json(delivery);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.updateDeliveryStatus = async (req, res) => {
    try {
      if (req.user.role !== 'productManager') {
        return res.status(403).json({ message: "Only product managers can update delivery status." });
      }
  
      const { delivery_status } = req.body;
      await Deliveries.updateStatus(req.params.id, delivery_status);
      res.json({ message: "Delivery status updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };  