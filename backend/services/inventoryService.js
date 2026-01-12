const Insumo = require('../models/Insumo');
const Producto = require('../models/Producto');
const Movimiento = require('../models/Movimiento');

function toBase(value, unit) {
  if (value == null || unit == null) return Number(value) || 0;
  unit = unit.toString();
  switch(unit){
    case 'kg': return Number(value) * 1000;
    case 'g': return Number(value);
    case 'L': return Number(value) * 1000;
    case 'ml': return Number(value);
    case 'unidad': return Number(value);
    default: return Number(value);
  }
}

function formatDisplay(baseValue, unitType){
  if(unitType==='g'){
    if(baseValue>=1000) return (baseValue/1000).toFixed(2)+' kg';
    return baseValue+' g';
  }
  if(unitType==='ml'){
    if(baseValue>=1000) return (baseValue/1000).toFixed(2)+' L';
    return baseValue+' ml';
  }
  return baseValue+' '+unitType;
}

async function producir(productoId, cantidad, usuario='system'){
  const producto = await Producto.findById(productoId).populate({ path: 'receta', populate: { path: 'ingredientes.insumo' } });
  if(!producto) throw new Error('Producto no encontrado');
  if(!producto.receta) throw new Error('Receta no encontrada para este producto');
  const ingredientes = producto.receta.ingredientes;
  const faltantes = [];
  for(const ing of ingredientes){
    const insumo = await Insumo.findById(ing.insumo._id);
    const necesario = ing.cantidad_base * cantidad;
    if(insumo.cantidad_base < necesario){
      faltantes.push({ nombre: insumo.nombre, faltante: necesario - insumo.cantidad_base, unidad: ing.unidad_base });
    }
  }
  if(faltantes.length) return { ok:false, faltantes };
  const session = await Insumo.startSession();
  session.startTransaction();
  try{
    const movimiento = new Movimiento({ tipo:'producir', detalles:`Produciendo ${cantidad} x ${producto.nombre}`, usuario, items: [] });
    for(const ing of ingredientes){
      const necesario = ing.cantidad_base * cantidad;
      await Insumo.findByIdAndUpdate(ing.insumo._id, { $inc: { cantidad_base: -necesario }, $set: { ultima_actualizacion: new Date() }, $push: { historial: { cantidad: -necesario, tipo: 'salida', motivo: `Producción ${producto.nombre}` } } }, { session });
      movimiento.items.push({ insumo: ing.insumo._id, producto: producto._id, cantidad_delta: -necesario, unidad_base: ing.unidad_base });
    }
    producto.cantidad_en_stock += cantidad;
    await producto.save({ session });
    await movimiento.save({ session });
    await session.commitTransaction();
    session.endSession();
    return { ok:true, movimientoId: movimiento._id };
  }catch(err){
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

module.exports = { toBase, formatDisplay, producir };
