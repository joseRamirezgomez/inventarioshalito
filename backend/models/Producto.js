const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
  nombre: { type: String, required: true },
  sabor: { type: String },
  cantidad_en_stock: { type: Number, default: 0 },
  receta: { type: Schema.Types.ObjectId, ref: 'Receta' }
});

module.exports = mongoose.model('Producto', ProductoSchema);
