const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const inventory = require('../services/inventoryService');

router.get('/', async (req, res) => {
  const rows = await Producto.find().populate('receta');
  res.json(rows);
});

router.post('/', async (req, res) => {
  try{
    const { nombre, sabor, recetaId } = req.body;
    if(!nombre) return res.status(400).json({ error:'nombre es requerido' });
    const p = new Producto({ nombre, sabor, receta: recetaId });
    await p.save();
    res.json(p);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.post('/:id/producir', async (req, res) => {
  try{
    const { id } = req.params;
    const { cantidad, usuario } = req.body;
    const result = await inventory.producir(id, Number(cantidad), usuario || 'system');
    res.json(result);
  }catch(err){ res.status(400).json({ ok:false, error: err.message }); }
});

router.post('/:id/vender', async (req, res) => {
  try{
    const { id } = req.params;
    const { cantidad, usuario } = req.body;
    const prod = await Producto.findById(id);
    if(!prod) return res.status(404).json({ error:'Producto no encontrado' });
    if(prod.cantidad_en_stock < cantidad) return res.status(400).json({ error:'Stock insuficiente' });
    prod.cantidad_en_stock -= Number(cantidad);
    await prod.save();
    res.json({ ok:true });
  }catch(err){ res.status(500).json({ ok:false, error: err.message }); }
});

module.exports = router;
