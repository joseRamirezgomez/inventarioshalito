require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/insumos', require('./routes/insumos'));
app.use('/api/recetas', require('./routes/recetas'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/movimientos', require('./routes/movimientos'));

async function start(){
  const uri = process.env.MONGO_URI;
  if(!uri){ console.error('MONGO_URI not set. Copy .env.example to .env and set it.'); process.exit(1); }
  await mongoose.connect(uri, { dbName: 'pasteleria' });
  console.log('Connected to MongoDB');
  app.listen(port, ()=> console.log(`Backend running on http://localhost:${port}`));
}

start().catch(err=>{ console.error(err); process.exit(1); });
