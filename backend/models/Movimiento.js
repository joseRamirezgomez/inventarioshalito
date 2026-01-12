const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovimientoItem = new Schema({
  insumo: { type: Schema.Types.ObjectId, ref: 'Insumo' },
  producto: { type: Schema.Types.ObjectId, ref: 'Producto' },
  cantidad_delta: { type: Number },
  unidad_base: { type: String }
}, { _id: false });

const MovimientoSchema = new Schema({
  tipo: { type: String, enum: ['reabastecer','producir','vender','ajuste'], required: true },
  fecha: { type: Date, default: Date.now },
  detalles: String,
  usuario: { type: String, default: 'system' },
  items: { type: [MovimientoItem], default: [] }
});

module.exports = mongoose.model('Movimiento', MovimientoSchema);
