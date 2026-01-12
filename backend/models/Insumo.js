const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistItem = new Schema({
  fecha: { type: Date, default: Date.now },
  cantidad: Number,
  tipo: { type: String, enum: ['entrada','salida','ajuste'], default: 'ajuste' },
  motivo: String
}, { _id: false });

const InsumoSchema = new Schema({
  nombre: { type: String, required: true, unique: true },
  cantidad_base: { type: Number, default: 0 }, // stored in base (g, ml, unidad)
  unidad_base: { type: String, required: true, enum: ['g','ml','unidad','other'] },
  stock_minimo: { type: Number, default: 0 },
  ultima_actualizacion: { type: Date, default: Date.now },
  historial: { type: [HistItem], default: [] }
});

module.exports = mongoose.model('Insumo', InsumoSchema);
