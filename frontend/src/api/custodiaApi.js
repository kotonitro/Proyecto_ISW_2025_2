const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getToken() {
  // Asumimos que el token JWT se guarda en localStorage bajo 'token'
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    throw new Error(data?.message || data || `HTTP ${res.status}`);
  }

  return data;
}

export async function fetchBicicletasAlmacenadas() {
  const res = await request("/custodia/bicicletas/almacenadas", { method: "GET" });
  return res.data || res;
}

export async function postEntrada(payload) {
  if (!payload.idBicicleta || !payload.idBicicletero) {
    throw new Error("Datos de bicicleta o bicicletero incompletos.");
  }

  const res = await request(`/custodia/entrada`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data || res;
}

export async function postSalida(idRegistroAlmacen) {
  const res = await request(`/custodia/salida`, {
    method: "POST",
    body: JSON.stringify({ idRegistroAlmacen }),
  });
  return res.data || res;
}

export async function fetchRegistros(filters = {}) {
  const qs = new URLSearchParams(filters).toString();
  const res = await request(`/custodia/registros${qs ? `?${qs}` : ""}`);
  return res.data || res;
}

export async function fetchRegistroById(id) {
  const res = await request(`/custodia/registros/${id}`);
  return res.data || res;
}

export async function deleteRegistro(idRegistroAlmacen) {
  const res = await request(`/custodia/registros/${idRegistroAlmacen}`, {
    method: "DELETE",
  });
  return res.data || res;
}

export async function fetchHistorial(filters = {}) {
  const qs = new URLSearchParams(filters).toString();
  const res = await request(`/custodia/historial${qs ? `?${qs}` : ""}`);
  return res.data || res;
}

