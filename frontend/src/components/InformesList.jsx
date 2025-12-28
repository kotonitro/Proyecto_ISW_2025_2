import React, { useState } from 'react';

const InformesList = ({ informes, onDescargar, onDescargarZIP }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 8;

  const informesOrdenados = [...informes].sort((a, b) => b.idInforme - a.idInforme);
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const informesActuales = informesOrdenados.slice(indicePrimerItem, indiceUltimoItem);

  const totalPaginas = Math.ceil(informes.length / itemsPorPagina);
  
  const obtenerColor = (tipo) => {
      switch (tipo) {
        case 'ROBO':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'DAÑO FISICO': 
          return 'bg-orange-100 text-orange-800 border-orange-200'; 
        case 'PERDIDA':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200'; 
        case 'FALLA SISTEMA':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'MANTENIMIENTO':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'OTRO':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
          return 'bg-green-100 text-green-800 border-green-200';
      }
    };

  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const irPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-400 overflow-hidden">
      
      <div className="p-6 border-b border-gray-400 bg-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Historial de Informes</h2>
      </div>
      
      {informes.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          <p>No hay informes registrados aún.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border border-gray-600">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border border-gray-600">Tipo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border border-gray-600">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border border-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {informesActuales.map((info) => (
                  <tr key={info.idInforme || info.id} className="hover:bg-gray-50 transition-colors">
                    
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
                      
                      {info.idInforme}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-300">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border 
                        ${obtenerColor(info.tipoIncidente)}`}>   
                        {info.tipoIncidente}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 border border-gray-300">
                      {new Date(info.fechaInforme).toLocaleDateString('es-CL', {
                                timeZone: 'UTC',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border border-gray-300">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onDescargar(info.idInforme)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1 border border-blue-800"
                          title="Descargar PDF"
                        >
                          Informe.PDF
                        </button>

                        <button 
                          onClick={() => onDescargarZIP(info.idInforme)} 
                          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-3 py-1.5 rounded text-sm font-bold transition-colors shadow-sm flex items-center gap-1 border border-yellow-500"
                          title="Descargar Evidencias"
                        >
                          Documentos.ZIP
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-t border-gray-400 sm:px-6">
            <div className="flex-1 flex justify-between sm:justify-center gap-4">
              <button 
                onClick={irPaginaAnterior} 
                disabled={paginaActual === 1}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md 
                  ${paginaActual === 1 
                    ? 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed' 
                    : 'border-gray-400 text-gray-700 bg-white hover:bg-gray-200'}`}
              >
                Anterior
              </button>
              
              <span className="text-sm text-gray-700 self-center">
                Página <span className="font-bold">{paginaActual}</span> de <span className="font-bold">{totalPaginas}</span>
              </span>

              <button 
                onClick={irPaginaSiguiente} 
                disabled={paginaActual === totalPaginas}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md 
                  ${paginaActual === totalPaginas 
                    ? 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed' 
                    : 'border-gray-400 text-gray-700 bg-white hover:bg-gray-200'}`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InformesList;