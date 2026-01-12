import React from 'react';

export default function Dashboard({ insumos, productos }){
  const low = insumos.filter(i => i.cantidad_base <= i.stock_minimo);
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5>Resumen</h5>
            <div>Tortas en stock: <strong>{productos.reduce((s,p)=>s+p.cantidad_en_stock,0)}</strong></div>
          </div>
          <div>
            <h5>Alertas</h5>
            {low.length === 0 ? <div>No hay alertas</div> : <div className="text-danger">{low.length} insumos por debajo del mínimo</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
