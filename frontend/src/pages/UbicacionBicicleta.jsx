import React, { useState } from "react";
import axios from "axios";

export default function UbicacionBicicleta() {
  const [rut, setRut] = useState("");
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // Formatear RUT automáticamente (12345678-K)
  const formatRut = (value) => {
    let clean = value.replace(/[^0-9kK]/g, "");
    if (clean.length > 1) {
      clean = clean.slice(0, -1) + "-" + clean.slice(-1);
    }
    return clean;
  };

  const handleRutChange = (e) => {
    setRut(formatRut(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rut) return;

    setLoading(true);
    setError(null);
    setSearched(false);
    setUbicaciones([]);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/custodia/ubicacion/${rut}` || "http://localhost:3000/api/custodia/ubicacion/${rut}"
      );

      if (response.data && response.data.data) {
        setUbicaciones(response.data.data);
      }
      setSearched(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al consultar la ubicación."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
        ¿Dónde está mi bicicleta?
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-blue-50/50">
        <form onSubmit={handleSubmit} className="mb-8">
          <label
            htmlFor="rutUsuario"
            className="block text-gray-700 font-bold mb-2 uppercase tracking-wide text-xs"
          >
            Ingrese su RUT
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              id="rutUsuario"
              value={rut}
              onChange={handleRutChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-lg"
              placeholder="12345678-K"
              maxLength={12}
            />
            <button
              type="submit"
              disabled={loading || !rut}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md uppercase tracking-wider text-sm w-full md:w-auto"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </form>

        <div className="border-t border-gray-100 pt-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {searched && ubicaciones.length === 0 && !error && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                No se encontraron bicicletas en custodia para este RUT.
              </p>
            </div>
          )}

          {ubicaciones.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center px-1">
                <svg
                  className="w-6 h-6 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Resultados Encontrados ({ubicaciones.length})
              </h2>

              <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-4 md:gap-6 snap-x snap-mandatory md:snap-none pb-6 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                {ubicaciones.map((registro) => (
                  <div
                    key={registro.idRegistro}
                    className="bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden hover:shadow-md transition-shadow duration-300 min-w-[85vw] md:min-w-0 md:w-full snap-center shrink-0"
                  >
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Imagen del Bicicletero */}
                      <div className="h-48 md:h-auto md:w-1/3 bg-gray-200 relative overflow-hidden group shrink-0">
                        {registro.bicicletero.imagen ? (
                          <img
                            src={registro.bicicletero.imagen}
                            alt={registro.bicicletero.nombre}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <span className="text-white font-bold text-lg drop-shadow-md leading-tight">
                            {registro.bicicletero.nombre}
                          </span>
                        </div>
                      </div>

                      {/* Detalles */}
                      <div className="p-5 md:p-6 md:w-2/3 flex flex-col justify-center flex-grow">
                        <div className="mb-4">
                          <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
                            Ubicación
                          </h3>
                          <p className="text-gray-800 font-medium text-lg flex items-start">
                            <svg
                              className="w-5 h-5 mr-1 text-red-500 mt-0.5 shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="break-words">
                              {registro.bicicletero.ubicacion}
                            </span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
                              Tu Bicicleta
                            </h3>
                            <p className="text-gray-700 font-medium truncate">
                              {registro.bicicleta.marca}{" "}
                              {registro.bicicleta.modelo}
                            </p>
                            <p className="text-gray-500 text-sm capitalize">
                              {registro.bicicleta.color}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
                              Ingreso
                            </h3>
                            <p className="text-gray-700 text-sm">
                              {new Date(
                                registro.fechaEntrada
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(
                                registro.fechaEntrada
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              hrs
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
