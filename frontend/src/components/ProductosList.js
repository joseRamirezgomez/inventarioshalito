import React from 'react';
import api from '../api';

export default function ProductosList({ productos, recetas, reload }){
  async function producir(id){
    const cantidad = prompt('¿Cuántas tortas producir? (número)');
    if (!cantidad) return;
    try {
      const res = await api.post(`/productos/${id}/producir`, { cantidad: Number(cantidad), usuario: 'admin' });
      if (res.data.ok) alert('Producido'); else alert('Faltan insumos: ' + JSON.stringify(res.data.faltantes));
    } catch(err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
    reload();
  }

  async function vender(id){
    const cantidad = prompt('¿Cuántas tortas vender? (número)');
    if (!cantidad) return;
    try {
      const res = await api.post(`/productos/${id}/vender`, { cantidad: Number(cantidad), usuario: 'admin' });
      if (res.data.ok) alert('Venta registrada'); else alert('Error: ' + JSON.stringify(res.data));
    } catch(err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
    reload();
  }

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>Productos (Tortas)</h5>
        <ul className="list-group">
          {productos.map(p=> (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={p._id}>
              <div>
                <div><strong>{p.nombre}</strong> <small>({p.sabor})</small></div>
                <div>Stock: {p.cantidad_en_stock}</div>
              </div>
              <div>
                <button className="btn btn-sm btn-success me-1" onClick={()=>producir(p._id)}>Producir</button>
                <button className="btn btn-sm btn-danger" onClick={()=>vender(p._id)}>Vender</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <h6>Crear producto</h6>
          <CreateProductForm recetas={recetas} reload={reload} />
        </div>
      </div>
    </div>
  );
}

function CreateProductForm({ recetas, reload }){
  async function submit(e){
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const sabor = e.target.sabor.value;
    const recetaId = e.target.recetaId.value || null;
    try{
      await api.post('/productos', { nombre, sabor, recetaId });
      reload();
      e.target.reset();
    }catch(err){ alert('Error creando producto: '+(err.response?.data?.error || err.message)); }
  }

  return (
    <form onSubmit={submit} className="d-flex gap-2">
      <input name="nombre" placeholder="Nombre producto" className="form-control" required />
      <input name="sabor" placeholder="Sabor" className="form-control" />
      <select name="recetaId" className="form-control">
        <option value="">-- (sin receta) --</option>
        {recetas.map(r=> <option key={r._id} value={r._id}>{r.nombre}</option>)}
      </select>
      <button className="btn btn-primary">Crear</button>
    </form>
  );
}
