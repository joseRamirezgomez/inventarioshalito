const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredienteSchema = new Schema({
  insumo: { type: Schema.Types.ObjectId, ref: 'Insumo', required: true },
  cantidad_base: { type: Number, required: true },
  unidad_base: { type: String, required: true }
}, { _id: false });

const RecetaSchema = new Schema({
  nombre: { type: String, required: true },
  ingredientes: { type: [IngredienteSchema], default: [] }
});

module.exports = mongoose.model('Receta', RecetaSchema);
