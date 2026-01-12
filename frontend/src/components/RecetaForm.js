import React, { useState } from 'react';
import api from '../api';

export default function RecetaForm({ recetas, insumos, reload }){
  const [nombre, setNombre] = useState('');
  const [ingredientes, setIngredientes] = useState([]);

  function addInsumo(){ setIngredientes([...ingredientes, { insumoId: '', cantidad: 0, unidad: 'g' }]); }
  function removeInsumo(idx){ setIngredientes(ings => ings.filter((_,i)=>i!==idx)); }

  async function submit(e){
    e.preventDefault();
    try{
      await api.post('/recetas', { nombre, ingredientes: ingredientes.map(i=>({ insumoId: i.insumoId, cantidad: Number(i.cantidad), unidad: i.unidad })) });
      setNombre(''); setIngredientes([]);
      reload();
    }catch(err){ alert('Error creando receta: '+(err.response?.data?.error || err.message)); }
  }

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5>Crear receta</h5>
        <form onSubmit={submit}>
          <div className="mb-2">
            <input value={nombre} onChange={e=>setNombre(e.target.value)} className="form-control" placeholder="Nombre receta" required />
          </div>
          {ingredientes.map((ing, idx)=> (
            <div key={idx} className="d-flex gap-2 mb-2">
              <select className="form-control" value={ing.insumoId || ''} onChange={e=>{ const copy=[...ingredientes]; copy[idx].insumoId = e.target.value; setIngredientes(copy); }} required>
                <option value="">-- seleccionar insumo --</option>
                {insumos.map(i=> <option key={i._id} value={i._id}>{i.nombre} ({i.unidad_base})</option>)}
              </select>
              <input type="number" className="form-control" value={ing.cantidad} onChange={e=>{ const copy=[...ingredientes]; copy[idx].cantidad = Number(e.target.value); setIngredientes(copy); }} required />
              <select className="form-control" value={ing.unidad} onChange={e=>{ const copy=[...ingredientes]; copy[idx].unidad = e.target.value; setIngredientes(copy); }}>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="unidad">unidad</option>
                <option value="ml">ml</option>
                <option value="L">L</option>
              </select>
              <button type="button" className="btn btn-danger btn-sm" onClick={()=>removeInsumo(idx)}>X</button>
            </div>
          ))}
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-secondary" onClick={addInsumo}>Agregar ingrediente</button>
            <button type="submit" className="btn btn-primary">Crear receta</button>
          </div>
        </form>
      </div>
    </div>
  );
}
