import React from "react";

const CheckInModal = ({
  showCheckInModal,
  setShowCheckInModal,
  checkInUser,
  setCheckInUser,
  checkInBike,
  setCheckInBike,
  idBicicletero,
  setIdBicicletero,
  handleConfirmCheckIn,
  LISTA_BICICLETEROS,
}) => {
  if (!showCheckInModal || !checkInUser || !checkInBike) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Registrar Ingreso a Custodia
        </h3>
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-sm">
              <strong>Usuario:</strong> {checkInUser.nombre}
            </p>
            <p className="text-sm">
              <strong>RUT:</strong> {checkInUser.rut}
            </p>
            <p className="text-sm">
              <strong>Bicicleta:</strong> {checkInBike.marca}{" "}
              {checkInBike.modelo} ({checkInBike.color})
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Bicicletero
            </label>
            <select
              value={idBicicletero}
              onChange={(e) => setIdBicicletero(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white"
            >
              <option value="">-- Seleccione --</option>
              {LISTA_BICICLETEROS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => {
                setShowCheckInModal(false);
                setCheckInUser(null);
                setCheckInBike(null);
              }}
              className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmCheckIn}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold"
            >
              Confirmar Entrada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
