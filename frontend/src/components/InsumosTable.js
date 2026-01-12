import React, { useState } from 'react';
import api from '../api';
import { formatBase } from '../utils';

export default function InsumosTable({ insumos, reload }){
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('kg');
  const [stockMin, setStockMin] = useState('');

  async function createInsumo(e){
    e.preventDefault();
    try{
      await api.post('/insumos', { nombre, cantidad: Number(cantidad), unidad, stock_minimo: Number(stockMin||0) });
      setNombre(''); setCantidad(''); setUnidad('kg'); setStockMin('');
      setShowForm(false);
      reload();
    }catch(err){ alert('Error creando insumo: '+(err.response?.data?.error || err.message)); }
  }

  async function reabastecer(id){
    const cantidad = prompt('Cantidad a reabastecer (ej: 2 kg -> 2, unidad -> 10)');
    if(!cantidad) return;
    const unidad = prompt('Unidad (g, kg, ml, L, unidad)');
    if(!unidad) return;
    await api.post(`/insumos/${id}/reabastecer`, { cantidad: Number(cantidad), unidad, usuario: 'admin' });
    reload();
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Insumos</h5>
          <div>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>setShowForm(s=>!s)}>{showForm ? 'Cancelar' : 'Agregar insumo'}</button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={createInsumo} className="mb-3">
            <div className="mb-2">
              <input className="form-control" placeholder="Nombre (ej: Harina)" value={nombre} onChange={e=>setNombre(e.target.value)} required/>
            </div>
            <div className="d-flex gap-2 mb-2">
              <input className="form-control" placeholder="Cantidad (ej: 25)" value={cantidad} onChange={e=>setCantidad(e.target.value)} required/>
              <select className="form-control" value={unidad} onChange={e=>setUnidad(e.target.value)}>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
                <option value="unidad">unidad</option>
              </select>
              <input className="form-control" placeholder="Stock mínimo (ej: 2000)" value={stockMin} onChange={e=>setStockMin(e.target.value)}/>
            </div>
            <div><button className="btn btn-primary btn-sm">Crear insumo</button></div>
          </form>
        )}

        <table className="table">
          <thead>
            <tr><th>Nombre</th><th>Cantidad</th><th>Unidad</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {insumos.map(i=> (
              <tr key={i._id}>
                <td>{i.nombre}</td>
                <td>{formatBase(i.cantidad_base, i.unidad_base)}</td>
                <td>{i.unidad_base}</td>
                <td><button className="btn btn-sm btn-primary" onClick={()=>reabastecer(i._id)}>Reabastecer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
