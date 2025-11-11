import React, { useState } from "react";
import { postEntrada } from "../api/custodiaApi";

export default function CustodiaForm({ onSuccess }) {
  const [form, setForm] = useState({
    rutUsuario: "",
    nombreUsuario: "",
    emailUsuario: "",
    telefonoUsuario: "",
    idBicicleta: "",
    idBicicletero: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validación mínima
      if (!form.rutUsuario || !form.idBicicleta || !form.idBicicletero) {
        setError("RUT, ID Bicicleta e ID Bicicletero son obligatorios");
        setLoading(false);
        return;
      }

      await postEntrada({
        ...form,
        idBicicleta: parseInt(form.idBicicleta, 10),
        idBicicletero: parseInt(form.idBicicletero, 10),
      });

      setForm({ rutUsuario: "", nombreUsuario: "", emailUsuario: "", telefonoUsuario: "", idBicicleta: "", idBicicletero: "" });
      if (onSuccess) onSuccess();
      alert("Entrada registrada correctamente");
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Registrar Entrada</h2>
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="rut">RUT del Usuario</label>
        <input id="rut" name="rutUsuario" value={form.rutUsuario} onChange={change} placeholder="Ej: 12345678-K" />
      </div>
      
      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombreUsuario" value={form.nombreUsuario} onChange={change} placeholder="Nombre completo" />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" name="emailUsuario" value={form.emailUsuario} onChange={change} type="email" placeholder="correo@ejemplo.com" />
      </div>
      
      <div className="form-group">
        <label htmlFor="telefono">Teléfono</label>
        <input id="telefono" name="telefonoUsuario" value={form.telefonoUsuario} onChange={change} placeholder="+56 9 1234 5678" />
      </div>
      
      <div className="form-group">
        <label htmlFor="bicicleta">ID Bicicleta</label>
        <input id="bicicleta" name="idBicicleta" value={form.idBicicleta} onChange={change} type="number" placeholder="1" />
      </div>
      
      <div className="form-group">
        <label htmlFor="bicicletero">ID Bicicletero</label>
        <input id="bicicletero" name="idBicicletero" value={form.idBicicletero} onChange={change} type="number" placeholder="1" />
      </div>
      
      <button type="submit" disabled={loading}>{loading ? "Registrando..." : "Registrar Entrada"}</button>
    </form>
  );
}
