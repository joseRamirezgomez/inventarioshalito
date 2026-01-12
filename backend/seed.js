require('dotenv').config();
const mongoose = require('mongoose');
const Insumo = require('./models/Insumo');
const Receta = require('./models/Receta');
const Producto = require('./models/Producto');

async function main(){
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pasteleria';
  await mongoose.connect(uri, { dbName: 'pasteleria' });
  console.log('Connected to DB for seeding');
  await Insumo.deleteMany({});
  await Receta.deleteMany({});
  await Producto.deleteMany({});

  const now = new Date();
  const harina = await Insumo.create({ nombre:'Harina', cantidad_base:25000, unidad_base:'g', stock_minimo:2000, ultima_actualizacion: now, historial:[{ cantidad:25000, tipo:'entrada', motivo:'seed' }] });
  const huevos = await Insumo.create({ nombre:'Huevos', cantidad_base:180, unidad_base:'unidad', stock_minimo:20, ultima_actualizacion: now, historial:[{ cantidad:180, tipo:'entrada', motivo:'seed' }] });
  const azucar = await Insumo.create({ nombre:'Azucar', cantidad_base:10000, unidad_base:'g', stock_minimo:2000, ultima_actualizacion: now, historial:[{ cantidad:10000, tipo:'entrada', motivo:'seed' }] });
  const leche = await Insumo.create({ nombre:'Leche', cantidad_base:5000, unidad_base:'ml', stock_minimo:1000, ultima_actualizacion: now, historial:[{ cantidad:5000, tipo:'entrada', motivo:'seed' }] });
  const mantequilla = await Insumo.create({ nombre:'Mantequilla', cantidad_base:3000, unidad_base:'g', stock_minimo:500, ultima_actualizacion: now, historial:[{ cantidad:3000, tipo:'entrada', motivo:'seed' }] });

  const recetaV = await Receta.create({ nombre:'Torta Vainilla', ingredientes:[
    { insumo: harina._id, cantidad_base:600, unidad_base:'g' },
    { insumo: huevos._id, cantidad_base:6, unidad_base:'unidad' },
    { insumo: azucar._id, cantidad_base:200, unidad_base:'g' }
  ]});

  const recetaC = await Receta.create({ nombre:'Torta Chocolate', ingredientes:[
    { insumo: harina._id, cantidad_base:650, unidad_base:'g' },
    { insumo: huevos._id, cantidad_base:7, unidad_base:'unidad' },
    { insumo: azucar._id, cantidad_base:250, unidad_base:'g' },
    { insumo: mantequilla._id, cantidad_base:100, unidad_base:'g' }
  ]});

  await Producto.create({ nombre:'Torta Vainilla 20cm', sabor:'Vainilla', cantidad_en_stock:5, receta: recetaV._id });
  await Producto.create({ nombre:'Torta Chocolate 20cm', sabor:'Chocolate', cantidad_en_stock:3, receta: recetaC._id });

  console.log('Seed complete');
  process.exit(0);
}

main().catch(err=>{ console.error(err); process.exit(1); });
