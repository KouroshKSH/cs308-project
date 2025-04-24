const Returns = require('../models/returns');

exports.createReturn = async (req, res) => {
  try {
    const { order_item_id, refund_amount } = req.body;
    const returnId = await Returns.create({ order_item_id, refund_amount });
    res.status(201).json({ message: 'Return request created', return_id: returnId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllReturns = async (req, res) => {
  try {
    const returns = await Returns.getAll();
    res.json(returns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Returns.updateStatus(req.params.id, status);
    res.json({ message: 'Return status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
