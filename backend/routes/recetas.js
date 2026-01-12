const express = require('express');
const router = express.Router();
const Receta = require('../models/Receta');
const { toBase } = require('../services/inventoryService');

router.get('/', async (req, res) => {
  const recetas = await Receta.find().populate('ingredientes.insumo');
  res.json(recetas);
});

router.post('/', async (req, res) => {
  try{
    const { nombre, ingredientes } = req.body;
    if(!nombre) return res.status(400).json({ error: 'nombre es requerido' });
    const ings = (ingredientes||[]).map(i => ({ insumo: i.insumoId, cantidad_base: toBase(Number(i.cantidad), i.unidad), unidad_base: i.unidad }));
    const receta = new Receta({ nombre, ingredientes: ings });
    await receta.save();
    res.json(receta);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;
