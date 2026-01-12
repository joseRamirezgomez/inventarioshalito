const express = require('express');
const router = express.Router();
const Movimiento = require('../models/Movimiento');

router.get('/', async (req, res) => {
  const movs = await Movimiento.find().sort('-fecha').limit(200).populate('items.insumo items.producto');
  res.json(movs);
});

module.exports = router;
