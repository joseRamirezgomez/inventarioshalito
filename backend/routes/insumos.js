const express = require('express');
const router = express.Router();
const Insumo = require('../models/Insumo');
const Movimiento = require('../models/Movimiento');
const { toBase } = require('../services/inventoryService');

router.get('/', async (req, res) => {
  const rows = await Insumo.find().sort('nombre');
  res.json(rows);
});

router.post('/', async (req, res) => {
  try{
    const { nombre, cantidad, unidad, stock_minimo } = req.body;
    if(!nombre) return res.status(400).json({ error: 'nombre es requerido' });
    const cantidad_base = toBase(Number(cantidad)||0, unidad || 'g');
    const unidad_base = (unidad === 'kg' || unidad === 'g') ? 'g' : (unidad === 'L' || unidad === 'ml') ? 'ml' : (unidad === 'unidad' ? 'unidad' : 'other');
    const insumo = new Insumo({ nombre, cantidad_base, unidad_base, stock_minimo: stock_minimo||0, ultima_actualizacion: new Date(), historial: [{ cantidad: cantidad_base, tipo: 'entrada', motivo: 'crear' }] });
    await insumo.save();
    res.json(insumo);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const { nombre, cantidad, unidad, stock_minimo } = req.body;
    const update = {};
    if(nombre) update.nombre = nombre;
    if(cantidad != null) update.cantidad_base = toBase(Number(cantidad), unidad || 'g');
    if(unidad) update.unidad_base = (unidad === 'kg' || unit === 'g') ? 'g' : (unidad === 'L' || unidad === 'ml') ? 'ml' : (unidad === 'unidad' ? 'unidad' : 'other');
    if(stock_minimo != null) update.stock_minimo = stock_minimo;
    update.ultima_actualizacion = new Date();
    const insumo = await Insumo.findByIdAndUpdate(id, update, { new:true });
    res.json(insumo);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.post('/:id/reabastecer', async (req, res) => {
  try{
    const { id } = req.params;
    const { cantidad, unidad, usuario, motivo } = req.body;
    const cantidad_base = toBase(Number(cantidad), unidad);
    const insumo = await Insumo.findByIdAndUpdate(id, { $inc: { cantidad_base }, $set: { ultima_actualizacion: new Date() }, $push: { historial: { cantidad: cantidad_base, tipo: 'entrada', motivo: motivo || 'reabastecer' } } }, { new:true });
    const mov = new Movimiento({ tipo:'reabastecer', detalles:`Reabastecer ${insumo.nombre} +${cantidad} ${unidad}`, usuario: usuario||'system', items:[{ insumo: insumo._id, cantidad_delta: cantidad_base, unidad_base: unidad }] });
    await mov.save();
    res.json({ ok:true, insumo });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;
