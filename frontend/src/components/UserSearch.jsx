import React from 'react';

const UserSearch = ({ rutSearch, setRutSearch, handleSearch, loading, setIsCreating, setCurrentUser, setUserForm, setBikeForm, setUserBicicletas, formatRut, COLOR_PALETA }) => {
  return (
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
  );
};

export default UserSearch;
