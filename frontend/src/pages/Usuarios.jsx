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
import { postEntrada } from "../api/custodiaApi";
import UserSearch from "../components/UserSearch";
import UserForm from "../components/UserForm";
import BikeList from "../components/BikeList";
import CheckInModal from "../components/CheckInModal";

const LISTA_BICICLETEROS = [
  { id: 1, nombre: "Bicicletero 1 - Av. Principal" },
  { id: 2, nombre: "Bicicletero 2 - Plaza Central" },
  { id: 3, nombre: "Bicicletero 3 - Parque Norte" },
  { id: 4, nombre: "Bicicletero 4 - Calle Secundaria" },
];

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

  // Check-in Modal States
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInUser, setCheckInUser] = useState(null);
  const [checkInBike, setCheckInBike] = useState(null);
  const [idBicicletero, setIdBicicletero] = useState("");

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

      // Fetch bike to update list and prepare for potential check-in
      let createdBike = null;
      try {
        const bikeRes = await getBicicletasByUsuario(newUser.idUsuario);
        setUserBicicletas(bikeRes.data.data);
        if (bikeRes.data.data.length > 0) createdBike = bikeRes.data.data[0];
      } catch (e) {
        setUserBicicletas([]);
      }

      if (createdBike) {
        if (
          window.confirm(
            "¿Desea registrar el ingreso a custodia de la bicicleta ahora?",
          )
        ) {
          setCheckInUser(newUser);
          setCheckInBike(createdBike);
          setShowCheckInModal(true);
        }
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

  const handleConfirmCheckIn = async () => {
    if (!idBicicletero) {
      alert("Debe seleccionar un bicicletero");
      return;
    }
    try {
      await postEntrada({
        rutUsuario: checkInUser.rut,
        idBicicleta: checkInBike.idBicicleta,
        idBicicletero: parseInt(idBicicletero),
      });
      alert("¡Ingreso a custodia registrado con éxito!");
      setShowCheckInModal(false);
      setCheckInUser(null);
      setCheckInBike(null);
      setIdBicicletero("");
    } catch (error) {
      alert(
        "Error al registrar ingreso: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-l-4 border-blue-600 pl-4">
        Gestión de Usuarios
      </h1>

      <UserSearch
        rutSearch={rutSearch}
        setRutSearch={setRutSearch}
        handleSearch={handleSearch}
        loading={loading}
        setIsCreating={setIsCreating}
        setCurrentUser={setCurrentUser}
        setUserForm={setUserForm}
        setBikeForm={setBikeForm}
        setUserBicicletas={setUserBicicletas}
        formatRut={formatRut}
        COLOR_PALETA={COLOR_PALETA}
      />

      {/* Correcting layout logic */}
      {!currentUser && isCreating && (
        <UserForm
          isCreating={isCreating}
          currentUser={currentUser}
          userForm={userForm}
          setUserForm={setUserForm}
          bikeForm={bikeForm}
          setBikeForm={setBikeForm}
          handleCreateUser={handleCreateUser}
          setIsCreating={setIsCreating}
          formatRut={formatRut}
          COLOR_PALETA={COLOR_PALETA}
        />
      )}

      {currentUser && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UserForm
            isCreating={isCreating}
            currentUser={currentUser}
            userForm={userForm}
            setUserForm={setUserForm}
            handleUpdateUser={handleUpdateUser}
            handleDeleteUser={handleDeleteUser}
            formatRut={formatRut}
          />

          <BikeList
            userBicicletas={userBicicletas}
            showAddBike={showAddBike}
            setShowAddBike={setShowAddBike}
            newBikeForm={newBikeForm}
            setNewBikeForm={setNewBikeForm}
            handleAddBike={handleAddBike}
            handleDeleteBike={handleDeleteBike}
            COLOR_PALETA={COLOR_PALETA}
          />
        </div>
      )}

      <CheckInModal
        showCheckInModal={showCheckInModal}
        setShowCheckInModal={setShowCheckInModal}
        checkInUser={checkInUser}
        setCheckInUser={setCheckInUser}
        checkInBike={checkInBike}
        setCheckInBike={setCheckInBike}
        idBicicletero={idBicicletero}
        setIdBicicletero={setIdBicicletero}
        handleConfirmCheckIn={handleConfirmCheckIn}
        LISTA_BICICLETEROS={LISTA_BICICLETEROS}
      />
    </div>
  );
};

export default Usuarios;
