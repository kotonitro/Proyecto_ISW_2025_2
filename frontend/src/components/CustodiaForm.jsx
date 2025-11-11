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
        setError("RUT, ID Bicicleta y ID Bicicletero son obligatorios");
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
    <form onSubmit={submit} style={{maxWidth:600}}>
      <h2>Registrar entrada</h2>
      {error && <div style={{color:"red"}}>{error}</div>}
      <div>
        <label>RUT</label>
        <input name="rutUsuario" value={form.rutUsuario} onChange={change} />
      </div>
      <div>
        <label>Nombre</label>
        <input name="nombreUsuario" value={form.nombreUsuario} onChange={change} />
      </div>
      <div>
        <label>Email</label>
        <input name="emailUsuario" value={form.emailUsuario} onChange={change} />
      </div>
      <div>
        <label>Teléfono</label>
        <input name="telefonoUsuario" value={form.telefonoUsuario} onChange={change} />
      </div>
      <div>
        <label>ID Bicicleta</label>
        <input name="idBicicleta" value={form.idBicicleta} onChange={change} />
      </div>
      <div>
        <label>ID Bicicletero</label>
        <input name="idBicicletero" value={form.idBicicletero} onChange={change} />
      </div>
      <div style={{marginTop:8}}>
        <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Registrar entrada"}</button>
      </div>
    </form>
  );
}
