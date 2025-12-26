import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Informes = () => {
  const hoy = new Date().toISOString().split('T')[0];
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: '',
    tipoIncidente: '',
    fechaInforme: hoy,
    idEncargado: 1 
  });
  
  
  const [archivos, setArchivos] = useState([]);

  const fetchInformes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/informes');
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
      const filesArray = Array.from(e.target.files);
      setArchivos(filesArray);
    }
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
      // peticion post
      await axios.post('http://localhost:3000/api/informes', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('¡Informe creado y documentos subidos!');
      
      setFormData({ descripcion: '', tipoIncidente: '', fechaInforme: '', idEncargado: 1 });
      setArchivos([]); // Limpia 
      
      fetchInformes(); // Actualiza 

    } catch (error) {
      console.error("Error:", error);
      alert('Hubo un error al crear el informe.');
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/informes/download/${id}`, {
        responseType: 'blob',
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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Panel de Informes</h1>

      <div style={{ background: '#f9f9f9', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ marginTop: 0 }}> Nuevo Informe</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tipo de Incidente:</label>
              <select 
                name="tipoIncidente" 
                value={formData.tipoIncidente} 
                onChange={handleInputChange} 
                required 
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Seleccione...</option>
                <option value="Daño Fisico">Daño Físico</option>
                <option value="Robo">Robo</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha:</label>
              <input 
                type="date" 
                name="fechaInforme" 
                value={formData.fechaInforme} 
                disabled 
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc',backgroundColor: '#e9ecef' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción:</label>
            <textarea 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleInputChange} 
              rows="4"
              required 
              placeholder="Describa detalladamente qué sucedió..."
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', border: '2px dashed #aaa', borderRadius: '8px', background: '#fff' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>
              Adjuntar Documentos o Fotos:
            </label>
            
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange}
              accept="image/*,application/pdf" 
              style={{ marginBottom: '10px' }}
            />

            {archivos.length > 0 && (
              <div style={{ background: '#eef', padding: '10px', borderRadius: '4px' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '0.9rem' }}>Archivos listos para subir:</p>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
                  {archivos.map((file, index) => (
                    <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: loading ? '#ccc' : '#28a745', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px', 
              fontSize: '16px', 
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? 'Subiendo datos y archivos...' : 'Guardar Informe Completo'}
          </button>
        </form>
      </div>

      <div>
        <h2> Historial</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#333', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Incidente</th>
              <th style={{ padding: '10px' }}>Fecha</th>
              <th style={{ padding: '10px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((info) => (
              <tr key={info.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{info.id}</td>
                <td style={{ padding: '10px' }}>{info.tipoIncidente}</td>
                <td style={{ padding: '10px' }}>{info.fechaInforme}</td>
                <td style={{ padding: '10px' }}>
                  <button 
                    onClick={() => descargarPDF(info.id)}
                    style={{ background: '#007bff', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Descargar PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Informes;