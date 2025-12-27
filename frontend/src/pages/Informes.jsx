import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InformesList from '../components/InformesList';

const Informes = () => {
  const hoy = new Date().toLocaleDateString('en-CA');
  const idUsuarioLogueado = Number(localStorage.getItem("idEncargado"));
  const token = localStorage.getItem("token");

  if (!idUsuarioLogueado) {
    console.warn("No hay usuario logueado");
  }

  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: '',
    tipoIncidente: '',
    fechaInforme: hoy,
    idEncargado: idUsuarioLogueado 
  });
  
  const [archivos, setArchivos] = useState([]);

  const fetchInformes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('http://localhost:3000/api/informes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInformes(res.data.data || res.data); 
    } catch (error) {
      console.error("Error cargando informes:", error);
    }
  };

  useEffect(() => {
    fetchInformes();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const nuevosArchivos = Array.from(e.target.files);
      setArchivos((prevArchivos) => {
        const totalArchivos = [...prevArchivos, ...nuevosArchivos];
        if (totalArchivos.length > 5) {
          alert("Solo puedes subir un máximo de 5 archivos por informe.");
          return prevArchivos;
        }
        return totalArchivos;
      });
    }
    e.target.value = ""; 
  };
  
  const removerArchivo = (indexToRemove) => {
    setArchivos((prevArchivos) => 
      prevArchivos.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('descripcion', formData.descripcion);
      data.append('tipoIncidente', formData.tipoIncidente);
      data.append('idEncargado', formData.idEncargado);

      archivos.forEach((archivo) => {

        data.append('archivosExtras', archivo);
      });
      
      await axios.post('http://localhost:3000/api/informes', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      alert('¡Informe creado y documentos subidos!');
      setFormData({ descripcion: '', tipoIncidente: '', fechaInforme: hoy, idEncargado: idUsuarioLogueado });
      setArchivos([]); 
      fetchInformes(); 

    } catch (error) {
      console.error("Error:", error);
      alert('Hubo un error al crear el informe.');
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/informes/download/${id}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `informe_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert("Error al descargar el PDF");
    }
  };
  
  const descargarZIP = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/informes/download-zip/${id}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Evidencias_Informe_${id}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error descargando ZIP:", error);
      alert("Error al descargar las evidencias.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Panel de Informes</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-400">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
             Nuevo Informe
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo Incidente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Incidente
                </label>
                <select 
                  name="tipoIncidente" 
                  value={formData.tipoIncidente} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                >
                  <option value="">Seleccione...</option>
                  <option value="Daño Fisico">Daño Físico</option>
                  <option value="Robo">Robo</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input 
                  type="date" 
                  name="fechaInforme" 
                  value={formData.fechaInforme} 
                  disabled 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleInputChange} 
                rows="4"
                required 
                placeholder="Describa detalladamente qué sucedió..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none transition-colors"
              />
            </div>

            {/* Zona de Archivos */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
              <label className="block text-sm font-bold text-gray-600 mb-3">
                Adjuntar Documentos o Fotos
              </label>
              
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                accept="image/*,application/pdf" 
                disabled={archivos.length >= 5}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
              />
              
              <p className="text-xs text-gray-500 mt-2">
                 ({archivos.length}/5 archivos seleccionados)
              </p>
                        
              {archivos.length > 0 && (
                <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                  <p className="font-semibold text-sm text-gray-700 mb-2">Archivos listos:</p>
                  <ul className="space-y-2">
                    {archivos.map((file, index) => (
                      <li key={index} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <span>{file.name} <span className="text-xs text-gray-400 ml-1">({(file.size / 1024).toFixed(1)} KB)</span></span>
                        <button 
                          type="button" 
                          onClick={() => removerArchivo(index)}
                          className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar archivo"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Botón Submit */}
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-200 
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-lg active:scale-[0.99]'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subiendo...
                </span>
              ) : 'Guardar Informe Completo'}
            </button>
          </form>
        </div>

        {/* --- LISTA DE INFORMES --- */}
        <InformesList 
          informes={informes} 
          onDescargar={descargarPDF} 
          onDescargarZIP={descargarZIP}
        />
      </div>
    </div>
  );
};

export default Informes;