import React, { useEffect, useState, useCallback } from "react";
import { fetchBicicletasAlmacenadas, postSalida } from "../api/custodiaApi";

const LISTA_BICICLETEROS = [
  { id: 1, nombre: "Bicicletero 1 - Av. Principal" },
  { id: 2, nombre: "Bicicletero 2 - Plaza Central" },
  { id: 3, nombre: "Bicicletero 3 - Parque Norte" },
  { id: 4, nombre: "Bicicletero 4 - Calle Secundaria" },
];

export default function CustodiaList({ addAlert, openConfirm }) {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBicicletasAlmacenadas();
      setRegistros(data);
    } catch (e) {
      addAlert("error", e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [addAlert]);

  useEffect(() => {
    load();
  }, [load]);

  function handleEliminar(idRegistro) {
    openConfirm(
      "¿Estás seguro?",
      "¿Deseas retirar este registro de custodia? La bicicleta será liberada del bicicletero.",
      async () => {
        try {
          await postSalida(idRegistro);
          await load();
          addAlert("success", "Registro retirado exitosamente");
        } catch (e) {
          addAlert("error", e.message || String(e));
        }
      },
    );
  }

  return (
    <>
    {/* encabezados*/}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Registro diario
            <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase">
              ALMACENADAS
            </span>
          </h2>
        </div>

        {loading && (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        {/* no hay bici*/}
        {!loading && registros.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No hay bicicletas almacenadas en este momento.
          </div>
        )}

        {!loading && registros.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left">
                    <div className="flex flex-col">
                      {/*columnas*/}
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                        Bicicleta
                      </span>
                      <span className="text-[10px] text-blue-700 font-medium normal-case mt-0.5">
                        Marca, Modelo, Color
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-blue-800">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-blue-800">
                    Bicicletero
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-blue-800">
                    Fecha Entrada
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registros.map((r) => (
                  <tr
                    key={r.idRegistroAlmacen}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {r.bicicleta
                          ? `${r.bicicleta.marca}, ${r.bicicleta.modelo}, ${r.bicicleta.color}`
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {r.nombreUsuario}
                      </div>
                      <div className="text-xs text-gray-500">
                        {r.rutUsuario}
                      </div>
                    </td>
              
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {LISTA_BICICLETEROS.find((b) => b.id === r.idBicicletero)
                        ?.nombre || `ID: ${r.idBicicletero}`}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 italic">
                      {r.fechaEntrada
                        ? new Date(r.fechaEntrada).toLocaleString("es-CL", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEliminar(r.idRegistroAlmacen)}
                        className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-all text-xs font-bold shadow-sm"
                      >
                        RETIRAR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
