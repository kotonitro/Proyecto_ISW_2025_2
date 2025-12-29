import React from "react";

const UserForm = ({
  isCreating,
  currentUser,
  userForm,
  setUserForm,
  bikeForm,
  setBikeForm,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  setIsCreating,
  formatRut,
  COLOR_PALETA,
}) => {
  if (isCreating && !currentUser) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Crear Nuevo Usuario
        </h2>
        <form onSubmit={handleCreateUser}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <h3 className="col-span-full font-semibold text-gray-600 border-b pb-2">
              Datos Personales
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUT
              </label>
              <input
                name="rut"
                value={userForm.rut}
                onChange={(e) =>
                  setUserForm({ ...userForm, rut: formatRut(e.target.value) })
                }
                placeholder="12.345.678-9"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                name="nombre"
                value={userForm.nombre}
                onChange={(e) =>
                  setUserForm({ ...userForm, nombre: e.target.value })
                }
                placeholder="Juan Pérez"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                name="email"
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                placeholder="juan.perez@ejemplo.com"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                name="telefono"
                type="text"
                value={userForm.telefono}
                onChange={(e) =>
                  setUserForm({ ...userForm, telefono: e.target.value })
                }
                placeholder="12345678"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <h3 className="col-span-full font-semibold text-gray-600 border-b pb-2 mt-4">
              Datos Bicicleta
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <input
                name="marca"
                value={bikeForm.marca}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, marca: e.target.value })
                }
                placeholder="Trek"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <input
                name="modelo"
                value={bikeForm.modelo}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, modelo: e.target.value })
                }
                placeholder="Marlin 5"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <select
                name="color"
                value={bikeForm.color}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, color: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-white"
                required
              >
                <option value="" disabled>
                  Seleccione color
                </option>
                {COLOR_PALETA.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
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
    );
  }

  if (currentUser) {
    return (
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
    );
  }

  return null;
};

export default UserForm;
