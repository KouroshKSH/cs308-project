const Returns = require('../models/returns');

exports.createReturn = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { order_item_id, order_id, quantity, refund_amount } = req.body;

    if (!order_item_id || !order_id) {
      return res.status(400).json({ message: "order_item_id and order_id are required" });
    }

    const returnId = await Returns.create({
      order_item_id,
      order_id,
      quantity,
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

    let returns;
    if (role === 'salesManager') {
      returns = await Returns.getAll();
    } else {
      returns = await Returns.getByUserId(userId);
    }

    res.json(returns);
  } catch (err) {
    console.error("Fetch returns failed:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (req.user.role !== 'salesManager') {
      return res.status(403).json({ message: "Only sales managers can approve or reject returns." });
    }

    await Returns.updateStatus(req.params.id, status);
    res.json({ message: "Return status updated" });
  } catch (err) {
    console.error("Update return status failed:", err);
    res.status(500).json({ error: err.message });
  }
};
