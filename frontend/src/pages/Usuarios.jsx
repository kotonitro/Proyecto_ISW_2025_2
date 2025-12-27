import React, { useState } from "react";
import {
  getUsuarioByRut,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../api/usuarioApi";
import {
  getBicicletasByUsuario,
  createBicicleta,
  deleteBicicleta,
} from "../api/bicicletaApi";

const Usuarios = () => {
  const [rutSearch, setRutSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userBicicletas, setUserBicicletas] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [userForm, setUserForm] = useState({
    rut: "",
    nombre: "",
    email: "",
    telefono: "",
  });
  const [bikeForm, setBikeForm] = useState({
    marca: "",
    modelo: "",
    color: "",
  });

  // New bike form for existing user
  const [newBikeForm, setNewBikeForm] = useState({
    marca: "",
    modelo: "",
    color: "",
  });
  const [showAddBike, setShowAddBike] = useState(false);

  const COLOR_PALETA = [
    "rojo",
    "azul",
    "verde",
    "negro",
    "blanco",
    "amarillo",
    "naranja",
    "morado",
    "gris",
    "marron",
    "rosa",
    "celeste",
    "turquesa",
    "violeta",
    "dorado",
    "plateado",
    "crema",
    "beige",
    "cyan",
    "magenta",
    "lila",
    "coral",
    "verde oscuro",
    "verde claro",
    "azul marino",
    "azul cielo",
    "rojo oscuro",
    "rojo vino",
    "gris oscuro",
    "gris claro",
    "marron oscuro",
    "marron claro",
    "rosa palo",
    "rosa fucsia",
    "morado oscuro",
    "naranja oscuro",
  ];

  const formatRut = (rut) => {
    // 1. Limpiar caracteres inválidos, dejar solo números y k/K

    let value = rut.replace(/[^0-9kK]/g, "");

    // 2. Si hay más de 1 carácter, poner el guion antes del último dígito

    if (value.length > 1) {
      value = value.slice(0, -1) + "-" + value.slice(-1);
    }

    return value;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!rutSearch) return;

    setLoading(true);

    try {
      const res = await getUsuarioByRut(rutSearch);

      const user = res.data.data;

      setCurrentUser(user);

      setUserForm({
        rut: user.rut,

        nombre: user.nombre,

        email: user.email,

        telefono: user.telefono || "",
      });

      setIsCreating(false);

      // Fetch bicycles independently

      try {
        const bikeRes = await getBicicletasByUsuario(user.idUsuario);

        setUserBicicletas(bikeRes.data.data);
      } catch (bikeError) {
        console.error("Error al obtener bicicletas:", bikeError);

        setUserBicicletas([]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (
          window.confirm(
            "Usuario no encontrado. ¿Desea crear un nuevo usuario?",
          )
        ) {
          setIsCreating(true);

          setCurrentUser(null);

          // Pre-fill the formatted RUT in the new form

          setUserForm({
            rut: rutSearch,

            nombre: "",

            email: "",

            telefono: "",
          });

          setBikeForm({ marca: "", modelo: "", color: COLOR_PALETA[0] });
        }
      } else {
        alert(
          "Error al buscar usuario: " +
            (error.response?.data?.message || error.message),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      // 1. Create User
      // Ensure telefono is string to satisfy Joi validation
      const userData = { ...userForm, telefono: String(userForm.telefono) };
      const userRes = await createUsuario(userData);
      const newUser = userRes.data.data;

      // 2. Create Bike
      try {
        await createBicicleta({
          ...bikeForm,
          idUsuario: newUser.idUsuario,
        });
      } catch (bikeError) {
        console.error("Error al crear bicicleta inicial:", bikeError);
        alert(
          "Usuario creado, pero hubo un error al crear la bicicleta: " +
            (bikeError.response?.data?.message || bikeError.message),
        );
        // We still proceed to show the user
      }

      alert("Usuario creado exitosamente");
      setIsCreating(false);
      setRutSearch(newUser.rut);
      setCurrentUser(newUser);

      // Fetch bike to update list
      try {
        const bikeRes = await getBicicletasByUsuario(newUser.idUsuario);
        setUserBicicletas(bikeRes.data.data);
      } catch (e) {
        setUserBicicletas([]);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      const errorDetails = error.response?.data?.errorDetails;
      if (errorDetails && Array.isArray(errorDetails)) {
        const messages = errorDetails.map((d) => `• ${d.message}`).join("\n");
        alert(`Error de validación:\n${messages}`);
      } else {
        alert(
          "Error al crear usuario: " +
            (error.response?.data?.message || error.message),
        );
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      // Exclude rut from update body as per controller logic (although controller handles it)
      const { rut, ...updateData } = userForm;
      await updateUsuario(currentUser.rut, updateData);
      alert("Usuario actualizado");
      // Refresh data?
      const res = await getUsuarioByRut(currentUser.rut);
      setCurrentUser(res.data.data);
    } catch (error) {
      alert(
        "Error al actualizar: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDeleteUser = async () => {
    if (
      !window.confirm(
        "¿Está seguro de eliminar este usuario? Esto eliminará también sus bicicletas.",
      )
    )
      return;
    try {
      await deleteUsuario(currentUser.rut);
      alert("Usuario eliminado");
      setCurrentUser(null);
      setUserBicicletas([]);
      setRutSearch("");
      setUserForm({ rut: "", nombre: "", email: "", telefono: "" });
    } catch (error) {
      alert(
        "Error al eliminar: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleAddBike = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await createBicicleta({
        ...newBikeForm,
        idUsuario: currentUser.idUsuario,
      });
      alert("Bicicleta agregada");
      setShowAddBike(false);
      setNewBikeForm({ marca: "", modelo: "", color: COLOR_PALETA[0] });
      // Refresh bikes
      const bikeRes = await getBicicletasByUsuario(currentUser.idUsuario);
      setUserBicicletas(bikeRes.data.data);
    } catch (error) {
      console.error("Error adding bike:", error);
      const errorDetails = error.response?.data?.errorDetails;
      if (errorDetails && Array.isArray(errorDetails)) {
        const messages = errorDetails.map((d) => `• ${d.message}`).join("\n");
        alert(`Error de validación:\n${messages}`);
      } else {
        alert(
          "Error al agregar bicicleta: " +
            (error.response?.data?.message || error.message),
        );
      }
    }
  };

  const handleDeleteBike = async (idBicicleta) => {
    if (!window.confirm("¿Eliminar bicicleta?")) return;
    try {
      await deleteBicicleta(idBicicleta);
      // Refresh
      const bikeRes = await getBicicletasByUsuario(currentUser.idUsuario);
      setUserBicicletas(bikeRes.data.data);
    } catch (error) {
      alert("Error al eliminar bicicleta");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-l-4 border-blue-600 pl-4">
        Gestión de Usuarios
      </h1>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100 flex flex-col md:flex-row gap-4 items-stretch md:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar por RUT
          </label>
          <input
            type="text"
            value={rutSearch}
            onChange={(e) => setRutSearch(formatRut(e.target.value))}
            placeholder="Ej: 12345678-9"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 font-bold shadow-md transition-all disabled:bg-blue-300 w-full md:w-auto"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
        <button
          onClick={() => {
            setIsCreating(true);
            setCurrentUser(null);
            setUserForm({ rut: "", nombre: "", email: "", telefono: "" });
            setBikeForm({ marca: "", modelo: "", color: COLOR_PALETA[0] });
            setUserBicicletas([]);
          }}
          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 font-bold shadow-md transition-all w-full md:w-auto"
        >
          Nuevo Usuario
        </button>
      </div>

      {/* Create Mode */}
      {isCreating && !currentUser && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Crear Nuevo Usuario
          </h2>
          <form onSubmit={handleCreateUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <h3 className="col-span-full font-semibold text-gray-600 border-b pb-2">
                Datos Personales
              </h3>
              <input
                name="rut"
                value={userForm.rut}
                onChange={(e) =>
                  setUserForm({ ...userForm, rut: formatRut(e.target.value) })
                }
                placeholder="RUT"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                name="nombre"
                value={userForm.nombre}
                onChange={(e) =>
                  setUserForm({ ...userForm, nombre: e.target.value })
                }
                placeholder="Nombre Completo"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                name="email"
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                name="telefono"
                type="number"
                value={userForm.telefono}
                onChange={(e) =>
                  setUserForm({ ...userForm, telefono: e.target.value })
                }
                placeholder="Teléfono"
                className="w-full px-3 py-2 border rounded-lg"
              />

              <h3 className="col-span-full font-semibold text-gray-600 border-b pb-2 mt-4">
                Datos Bicicleta
              </h3>
              <input
                name="marca"
                value={bikeForm.marca}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, marca: e.target.value })
                }
                placeholder="Marca"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                name="modelo"
                value={bikeForm.modelo}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, modelo: e.target.value })
                }
                placeholder="Modelo"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <select
                name="color"
                value={bikeForm.color}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, color: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-white"
                required
              >
                {COLOR_PALETA.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-gray-600 hover:text-gray-800 font-medium px-4"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 font-bold shadow-md"
              >
                Crear Usuario y Bicicleta
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User Found Mode */}
      {currentUser && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Details */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Datos del Usuario
            </h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500">RUT</label>
                <input
                  value={userForm.rut}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Nombre</label>
                <input
                  value={userForm.nombre}
                  onChange={(e) =>
                    setUserForm({ ...userForm, nombre: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <input
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Teléfono</label>
                <input
                  value={userForm.telefono}
                  onChange={(e) =>
                    setUserForm({ ...userForm, telefono: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  className="w-full bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200"
                >
                  Eliminar Usuario
                </button>
              </div>
            </form>
          </div>

          {/* Bicycles List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Bicicletas Registradas
                </h2>
                <button
                  onClick={() => setShowAddBike(!showAddBike)}
                  className="bg-green-600 text-white py-1 px-4 rounded-lg hover:bg-green-700 text-sm font-bold"
                >
                  {showAddBike ? "Cancelar" : "+ Agregar Bici"}
                </button>
              </div>

              {showAddBike && (
                <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Nueva Bicicleta
                  </h3>
                  <form
                    onSubmit={handleAddBike}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <input
                      placeholder="Marca"
                      value={newBikeForm.marca}
                      onChange={(e) =>
                        setNewBikeForm({
                          ...newBikeForm,
                          marca: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg"
                      required
                    />
                    <input
                      placeholder="Modelo"
                      value={newBikeForm.modelo}
                      onChange={(e) =>
                        setNewBikeForm({
                          ...newBikeForm,
                          modelo: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg"
                      required
                    />
                    <select
                      value={newBikeForm.color}
                      onChange={(e) =>
                        setNewBikeForm({
                          ...newBikeForm,
                          color: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg bg-white"
                      required
                    >
                      {COLOR_PALETA.map((c) => (
                        <option key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                    <div className="md:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Marca
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Modelo
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Color
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userBicicletas.map((bike) => (
                      <tr key={bike.idBicicleta}>
                        <td className="px-4 py-2">{bike.marca}</td>
                        <td className="px-4 py-2">{bike.modelo}</td>
                        <td className="px-4 py-2">{bike.color}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteBike(bike.idBicicleta)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {userBicicletas.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-4 text-gray-500"
                        >
                          Sin bicicletas registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
