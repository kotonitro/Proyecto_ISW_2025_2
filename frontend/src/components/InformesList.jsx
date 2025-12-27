import React, { useState } from 'react';

const InformesList = ({ informes, onDescargar, onDescargarZIP }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 8;


  const informesOrdenados = [...informes].sort((a, b) => b.idInforme - a.idInforme);
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const informesActuales = informesOrdenados.slice(indicePrimerItem, indiceUltimoItem);

  const totalPaginas = Math.ceil(informes.length / itemsPorPagina);

  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const irPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  return (
    <div>
      <h2>Historial de Informes</h2>
      
      {informes.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No hay informes registrados aún.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#333', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Tipo</th>
                <th style={{ padding: '10px' }}>Fecha</th>
                <th style={{ padding: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {informesActuales.map((info) => (
                <tr key={info.idInforme} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{info.idInforme}</td>
                  <td style={{ padding: '10px' }}>{info.tipoIncidente}</td>
                  <td style={{ padding: '10px' }}>{info.fechaInforme}</td>
                  <td style={{ padding: '10px' }}>
                    <button 
                      onClick={() => onDescargar(info.idInforme)}
                      style={{ 
                        background: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      Descargar PDF 
                    </button>
                    <button 
                      onClick={() => onDescargarZIP(info.idInforme)} 
                      title="Descargar Evidencias (ZIP)"
                      style={{ 
                      background: '#ffc107', // Amarillo/Naranja
                      color: '#000', 
                      border: 'none', 
                      padding: '6px 12px', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontWeight: 'bold'
                      }}
                       >
                       Evidencias
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <button 
              onClick={irPaginaAnterior} 
              disabled={paginaActual === 1}
              style={{ padding: '8px 16px', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer', opacity: paginaActual === 1 ? 0.5 : 1 }}
            >
              Anterior
            </button>

            <span style={{ fontWeight: 'bold' }}>
              Página {paginaActual} de {totalPaginas}
            </span>

            <button 
              onClick={irPaginaSiguiente} 
              disabled={paginaActual === totalPaginas}
              style={{ padding: '8px 16px', cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer', opacity: paginaActual === totalPaginas ? 0.5 : 1 }}
            >
              Siguiente 
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InformesList;