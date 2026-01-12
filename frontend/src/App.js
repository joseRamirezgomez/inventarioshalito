import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from './api';
import Dashboard from './components/Dashboard';
import InsumosTable from './components/InsumosTable';
import ProductosList from './components/ProductosList';
import RecetaForm from './components/RecetaForm';

function App(){
  const [insumos, setInsumos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadAll(){
    setLoading(true);
    try{
      const [ri, rp, rr] = await Promise.all([api.get('/insumos'), api.get('/productos'), api.get('/recetas')]);
      setInsumos(ri.data);
      setProductos(rp.data);
      setRecetas(rr.data);
    }catch(err){
      console.error('loadAll error', err);
      alert('Error cargando datos: ' + (err.response?.data?.error || err.message));
    }finally{ setLoading(false); }
  }

  useEffect(()=>{ loadAll(); }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-4">Inventario - Pastelería</h1>
      <Dashboard insumos={insumos} productos={productos} />
      <div className="row mt-4">
        <div className="col-md-7">
          <InsumosTable insumos={insumos} reload={loadAll} />
        </div>
        <div className="col-md-5">
          <ProductosList productos={productos} recetas={recetas} reload={loadAll} />
          <RecetaForm recetas={recetas} insumos={insumos} reload={loadAll} />
        </div>
      </div>
      {loading && <div className="fixed-bottom m-3"><div className="alert alert-info">Cargando...</div></div>}
    </div>
  );
}

export default App;
