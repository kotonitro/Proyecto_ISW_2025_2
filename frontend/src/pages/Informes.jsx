import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InformesList from '../components/InformesList';
import { TIPOS_INCIDENTE } from '../../../backend/src/utils/tiposIncidente'; 

const Informes = () => {
  const hoy = new Date().toLocaleDateString('en-CA');
  const idUsuarioLogueado = Number(localStorage.getItem("idEncargado"));
  const token = localStorage.getItem("token");

  const [listaBicicletas, setListaBicicletas] = useState([]);
  const [listaBicicleteros, setListaBicicleteros] = useState([]);

  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    descripcion: '',
    tipoIncidente: '',
    fechaInforme: hoy,
    idEncargado: idUsuarioLogueado,
    idBicicleta: '',   
    idBicicletero: ''  
  });

  const [archivos, setArchivos] = useState([]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const resInformes = await axios.get('http://localhost:3000/api/informes', config);
      setInformes(resInformes.data.data || resInformes.data);

      const resBicis = await axios.get('http://localhost:3000/api/bicicletas', config);
      setListaBicicletas(resBicis.data.data || resBicis.data);

      const resBicicleteros = await axios.get('http://localhost:3000/api/bicicleteros', config);
      setListaBicicleteros(resBicicleteros.data.data || resBicicleteros.data);

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
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
      setArchivos((prev) => {
        const total = [...prev, ...nuevosArchivos];
        return total.length > 5 ? prev : total;
      });
    }
    e.target.value = ""; 
  };
  
  const removerArchivo = (idx) => setArchivos(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('descripcion', formData.descripcion);
      data.append('tipoIncidente', formData.tipoIncidente);
      data.append('idEncargado', formData.idEncargado);
      
      if (formData.idBicicleta) data.append('idBicicleta', formData.idBicicleta);
      if (formData.idBicicletero) data.append('idBicicletero', formData.idBicicletero);

      archivos.forEach((archivo) => {
        data.append('archivosExtras', archivo);
      });

      await axios.post('http://localhost:3000/api/informes', data, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });

      alert('¡Informe creado exitosamente!');
      
      setFormData({ 
        descripcion: '', 
        tipoIncidente: '', 
        fechaInforme: hoy, 
        idEncargado: idUsuarioLogueado,
        idBicicleta: '', 
        idBicicletero: '' 
      });
      setArchivos([]);
      fetchData(); 

    } catch (error) {
      console.error("Error:", error);
      alert('Hubo un error al crear el informe.');
    } finally {
      setLoading(false);
    }
  };
  const tipoActual = formData.tipoIncidente; 
  const mostrarSelectorBicicleta = ['Robo', 'Daño Fisico', 'Perdida', 'ROBO', 'DAÑO FISICO', 'PERDIDA'].includes(tipoActual);
  const mostrarSelectorBicicletero = ['Mantenimiento', 'MANTENIMIENTO', 'Robo', 'Daño Fisico', 'Perdida', 'ROBO', 'DAÑO FISICO', 'PERDIDA'].includes(tipoActual);

  const descargarPDF = async (id) => {
     try {
       const token = localStorage.getItem("token");
       const response = await axios.get(
         `http://localhost:3000/api/informes/download/${id}`,
         {
           responseType: "blob",
           headers: { Authorization: `Bearer ${token}` },
         },
       );
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement("a");
       link.href = url;
       link.setAttribute("download", `informe_${id}.pdf`);
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
       const response = await axios.get(
         `http://localhost:3000/api/informes/download-zip/${id}`,
         {
           responseType: "blob",
           headers: { Authorization: `Bearer ${token}` },
         },
       );
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement("a");
       link.href = url;
       link.setAttribute("download", `Evidencias_Informe_${id}.zip`);
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

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Nuevo Informe</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tipo de Incidente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Incidente</label>
                <select 
                  name="tipoIncidente" 
                  value={formData.tipoIncidente} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Seleccione...</option>
                  {TIPOS_INCIDENTE.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <input 
                  type="date" 
                  name="fechaInforme" 
                  value={formData.fechaInforme} 
                  disabled 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* === SELECTOR DE BICICLETAS === */}
              {mostrarSelectorBicicleta && (
                <div className="md:col-span-2 bg-red-50 p-4 rounded-lg border border-red-100 animate-fadeIn">
                  <label className="block text-sm font-bold text-red-800 mb-2">
                    Seleccione la Bicicleta afectada:
                  </label>
                  <select
                    name="idBicicleta"
                    value={formData.idBicicleta}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                  >
                    <option value="">-- Seleccione Bicicleta --</option>
                    {listaBicicletas.map((bici) => (
                      <option key={bici.idBicicleta} value={bici.idBicicleta}>
                        #{bici.idBicicleta} - {bici.marca} {bici.modelo} ({bici.color})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* SELECTOR DE BICICLETEROS */}
              {mostrarSelectorBicicletero && (
                <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fadeIn">
                  <label className="block text-sm font-bold text-blue-800 mb-2">
                    {tipoActual && tipoActual.toUpperCase().includes('MANTENIMIENTO') 
                      ? "Seleccione el Bicicletero a mantener:" 
                      : "Lugar del incidente (Bicicletero):"}
                  </label>
                  <select
                    name="idBicicletero"
                    value={formData.idBicicletero}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">-- Seleccione Bicicletero --</option>
                    {listaBicicleteros.map((lugar) => (
                      <option key={lugar.idBicicletero} value={lugar.idBicicletero}>
                         {lugar.nombre || `Bicicletero #${lugar.idBicicletero}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleInputChange} 
                rows="4"
                required 
                placeholder="Describa detalladamente qué sucedió..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
              />
            </div>

            {/* Archivos */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
               <input type="file" multiple onChange={handleFileChange} accept="image/*,application/pdf" disabled={archivos.length >= 5} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"/>
               <p className="text-xs text-gray-500 mt-2">({archivos.length}/5 archivos seleccionados)</p>
               {archivos.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {archivos.map((file, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex justify-between">
                      {file.name} 
                      <button type="button" onClick={() => removerArchivo(idx)} className="text-red-500 font-bold ml-2">✕</button>
                    </li>
                  ))}
                </ul>
               )}
            </div>

            <button type="submit" disabled={loading} className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg shadow-md transition-all ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
              {loading ? 'Guardando...' : 'Guardar Informe Completo'}
            </button>
          </form>
        </div>

        <InformesList informes={informes} onDescargar={descargarPDF} onDescargarZIP={descargarZIP}/>
      </div>
    </div>
  );
};

export default Informes;