import React, { useState, useEffect, useRef } from "react";
import { postEntrada } from "../api/custodiaApi";
import axios from "axios";

const LISTA_BICICLETEROS = [
  { id: 1, nombre: "Bicicletero 1 - Av. Principal" },
  { id: 2, nombre: "Bicicletero 2 - Plaza Central" },
  { id: 3, nombre: "Bicicletero 3 - Parque Norte" },
  { id: 4, nombre: "Bicicletero 4 - Calle Secundaria" },
];

// Función para calcular el DV (Algoritmo Módulo 11)
function calcularDigitoVerificador(rut) {
  let suma = 0;
  let multiplicador = 2;

  // Recorremos el RUT de atrás hacia adelante
  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dv = 11 - resto;

  if (dv === 11) return "0";
  if (dv === 10) return "K";
  return dv.toString();
}

export default function CustodiaForm({ onSuccess }) {
  const [rutBase, setRutBase] = useState("");
  const [rutDV, setRutDV] = useState("");
  const [userData, setUserData] = useState(null);
  const [idBicicletero, setIdBicicletero] = useState("");
  const [idBicicletaSeleccionada, setIdBicicletaSeleccionada] = useState(""); // Nueva
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dvInputRef = useRef(null);

  useEffect(() => {
    if (rutBase.length >= 7 && rutDV.length === 1) {
      buscarUsuario();
    } else {
      setUserData(null);
      setError(null);
    }
  }, [rutBase, rutDV]);

  const buscarUsuario = async () => {
    setError(null);
    const rutCompleto = `${rutBase}-${rutDV}`;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/api/usuarios/${rutCompleto}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && res.data.data) {
        const user = res.data.data;

        // Guardar toda la información del usuario con sus bicicletas
        setUserData({
          ...user,
          bicicletas: user.bicicletas || []
        });

        // Si tiene solo una bicicleta, seleccionarla automáticamente
        if (user.bicicletas && user.bicicletas.length === 1) {
          setIdBicicletaSeleccionada(user.bicicletas[0].idBicicleta.toString());
        } else {
          setIdBicicletaSeleccionada(""); // Resetear si tiene múltiples
        }
      }
    } catch (e) {
      setUserData(null);
      setIdBicicletaSeleccionada("");
      setError("Usuario no encontrado.");
    }
  };

  const handleBaseChange = (e) => {
    // Limpiamos caracteres no numéricos
    const val = e.target.value.replace(/[^0-9]/g, "");

    if (val.length <= 8) {
      setRutBase(val); // Actualizamos lo que se ve en el input

      // --- AQUÍ ESTÁ EL CAMBIO ---
      // Solo calculamos si el largo es EXACTAMENTE 8
      if (val.length === 8) {
        const dvCalculado = calcularDigitoVerificador(val);
        setRutDV(dvCalculado);
        
        // Opcional: Pasar el foco al cuadrito del DV automáticamente
        dvInputRef.current.focus();
      } else {
        // Si tienes menos de 8 números (o estás borrando), limpiamos el DV
        setRutDV("");
      }
    }
  };

  const handleDVChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^0-9K]/g, "");
    if (val.length <= 1) setRutDV(val);
  };

  // En CustodiaForm.jsx, modifica la función submit:
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // El payload debe contener estos campos exactos para que el service no lance error
      const payload = {
        rutUsuario: `${rutBase}-${rutDV}`,
        idBicicleta: parseInt(idBicicletaSeleccionada, 10),
        idBicicletero: parseInt(idBicicletero, 10),
        // Datos del usuario recuperados en la búsqueda previa
        nombreUsuario: userData.nombre,
        emailUsuario: userData.email,
        telefonoUsuario: parseInt(userData.telefono, 10),
      };

      console.log("Enviando a custodia:", payload);

      await postEntrada(payload);

      // Limpieza tras éxito
      setRutBase(""); setRutDV(""); setUserData(null); setIdBicicletero(""); setIdBicicletaSeleccionada("");
      if (onSuccess) onSuccess();

    } catch (e) {
      // Aquí se mostrará el mensaje del service (ej: "Bicicleta ya tiene un registro activo")
      setError(e.message || "Error de validación en el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
  <form onSubmit={submit} className="bg-white p-5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-blue-50/50">
    <h2 className="text-lg font-bold text-blue-900 mb-5 px-1">Registro de Entrada</h2>

    <div className="space-y-5">
      {/* TARJETA DE IDENTIFICACIÓN UNIFICADA (Siempre Azul) */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-4 shadow-sm transition-all duration-300">
        
        {/* Decoración de fondo permanente pero sutil */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/40 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Título de la Sección (Siempre Azul) */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 ${
              userData ? "bg-blue-600 text-white shadow-sm" : "bg-blue-100 text-blue-500"
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {userData ? "Datos del usuario" : "Identificar Usuario"}
            </p>
          </div>

          {/* INPUTS DE RUT (Más compactos y estilizados) */}
          <div className="mb-3 bg-white/60 p-3 rounded-xl border border-blue-50/50 backdrop-blur-sm">
            <label className="block text-[10px] font-bold mb-1.5 ml-0.5 uppercase tracking-wider text-blue-700/70">
              Ingrese RUT
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="12345678"
                value={rutBase}
                onChange={handleBaseChange}
                className="w-full px-3 py-1.5 border border-blue-100 rounded-lg text-center font-mono text-base font-medium text-blue-900 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 outline-none bg-white shadow-sm transition-all placeholder:text-blue-200/70"
              />
              <span className="text-lg font-bold text-blue-300">-</span>
              <input
                ref={dvInputRef}
                type="text"
                placeholder="K"
                value={rutDV}
                onChange={handleDVChange}
                className="w-14 px-3 py-1.5 border border-blue-100 rounded-lg text-center font-mono text-base font-medium text-blue-900 uppercase focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 outline-none bg-white shadow-sm transition-all placeholder:text-blue-200/70"
              />
            </div>
          </div>

          {/* DATOS DEL USUARIO (Se expande al encontrar usuario) */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
              userData ? "max-h-96 opacity-100 pt-2 mt-2 border-t border-blue-100/80" : "max-h-0 opacity-0"
          }`}>
            {userData && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                
                {/* Resumen de Usuario */}
                <div className="flex justify-between items-start bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-0.5">Nombre</p>
                    <p className="text-sm font-bold text-blue-900 leading-tight line-clamp-1">{userData.nombre}</p>
                  </div>
                  <div className="flex flex-col items-center pl-2 border-l border-blue-200/40 ml-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-0.5 text-center">Bicicletas registradas</p>
                      <span className="text-xs font-bold text-blue-900">{userData.bicicletas?.length || 0}</span>
                    </div>
                  </div>

                {/* Selector de Bicicleta (Integrado) */}
                {userData.bicicletas && userData.bicicletas.length > 0 && (
                  <div>
                    <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1.5 ml-0.5">
                      Seleccionar Bicicleta
                    </label>
                    <select
                      value={idBicicletaSeleccionada}
                      onChange={(e) => setIdBicicletaSeleccionada(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white text-blue-900 outline-none focus:ring-2 focus:ring-blue-400/30 text-sm font-medium shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%233b82f6%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2082.2c3.6-3.6%205.4-7.8%205.4-12.8%200-5-1.8-9.3-5.4-12.9z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.7em] bg-no-repeat bg-[right_0.75rem_center] pr-8 transition-all hover:border-blue-300 cursor-pointer"
                    >
                      <option value="" className="text-gray-200">Marca, Modelo, Color...</option>
                      {userData.bicicletas.map((bici) => (
                        <option key={bici.idBicicleta} value={bici.idBicicleta} className="font-medium">
                          {bici.marca} , {bici.modelo} , {bici.color}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-xs font-medium rounded-r shadow-sm flex items-center animate-in fade-in">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {/* Selector de Bicicletero (Externo) */}
      <div className="px-1">
        <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Ubicación de Custodia</label>
        <div className="relative">
          <select
            value={idBicicletero}
            onChange={(e) => setIdBicicletero(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 border border-blue-100 rounded-xl bg-white/80 outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 appearance-none shadow-sm transition-all hover:border-blue-300 text-sm font-medium text-blue-900 cursor-pointer"
          >
            <option value="" className="text-gray-500">Seleccione un bicicletero...</option>
            {LISTA_BICICLETEROS.map((b) => (
              <option key={b.id} value={b.id} className="font-medium text-blue-900">{b.nombre}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
    </div>

    {/* Botón de Acción (Más pequeño y moderno) */}
    <button
      type="submit"
      disabled={loading || !userData || !idBicicletero || !idBicicletaSeleccionada}
      className={`mt-6 w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-md transition-all transform duration-200 flex items-center justify-center gap-2 ${
        loading || !userData || !idBicicletero || !idBicicletaSeleccionada
          ? "bg-blue-50 text-blue-300 border border-blue-100 cursor-not-allowed shadow-none"
          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
      }`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Procesando...
        </>
      ) : (
        "Confirmar Entrada"
      )}
    </button>
  </form>
);
}