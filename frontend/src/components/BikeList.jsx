import React from "react";
import DeleteButton from "./DeleteButton";

const BikeList = ({
  userBicicletas,
  showAddBike,
  setShowAddBike,
  newBikeForm,
  setNewBikeForm,
  handleAddBike,
  handleDeleteBike,
  COLOR_PALETA,
}) => {
  return (
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
                    <DeleteButton
                      onClick={() => handleDeleteBike(bike.idBicicleta)}
                    />
                  </td>
                </tr>
              ))}
              {userBicicletas.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Sin bicicletas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BikeList;
