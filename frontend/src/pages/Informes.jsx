import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InformesList from '../components/InformesList';

const Informes = () => {
  const hoy = new Date().toLocaleDateString("en-CA");
  const idUsuarioLogueado = Number(localStorage.getItem("idEncargado"));
  const token = localStorage.getItem("token");
  if (!idUsuarioLogueado) {
<<<<<<< HEAD
       console.warn("No hay usuario logueado");
    }
=======
    console.warn("No hay usuario logueado");
    // Aquí podrías poner un return null; o redirigir al login
  }
>>>>>>> 5f6d42b (FIX: modificación de algunos archivos para utilizar Tailwind)
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: "",
    tipoIncidente: "",
    fechaInforme: hoy,
    idEncargado: idUsuarioLogueado,
  });

  
  const [archivos, setArchivos] = useState([]);

  const fetchInformes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('http://localhost:3000/api/informes', {
              headers: {
                Authorization: `Bearer ${token}` 
              }
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
      [e.target.name]: e.target.value,
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

      data.append("descripcion", formData.descripcion);
      data.append("tipoIncidente", formData.tipoIncidente);
      data.append("idEncargado", formData.idEncargado);

      archivos.forEach((archivo) => {
        data.append("archivosExtras", archivo);
      });
      console.log("Enviando informe con ID Encargado:", formData.idEncargado);
      
      
      // peticion post
<<<<<<< HEAD
      await axios.post('http://localhost:3000/api/informes', data, {
        headers: { 
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}` 
                }
=======
      await axios.post("http://localhost:3000/api/informes", data, {
        headers: { "Content-Type": "multipart/form-data" },
>>>>>>> 5f6d42b (FIX: modificación de algunos archivos para utilizar Tailwind)
      });

      alert("¡Informe creado y documentos subidos!");

      setFormData({
        descripcion: "",
        tipoIncidente: "",
        fechaInforme: "",
        idEncargado: 1,
      });
      setArchivos([]); // Limpia

      fetchInformes(); // Actualiza
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al crear el informe.");
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async (id) => {
    try {
<<<<<<< HEAD
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/informes/download/${id}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
=======
      const response = await axios.get(
        `http://localhost:3000/api/informes/download/${id}`,
        {
          responseType: "blob",
        },
      );
>>>>>>> 5f6d42b (FIX: modificación de algunos archivos para utilizar Tailwind)
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
        const response = await axios.get(`http://localhost:3000/api/informes/download-zip/${id}`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}` 
          }
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
        alert("Error al descargar las evidencias (o no existen archivos adjuntos).");
      }
    };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Panel de Informes</h1>

      <div
        style={{
          background: "#f9f9f9",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginTop: 0 }}> Nuevo Informe</h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "15px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Tipo de Incidente:
              </label>
              <select
                name="tipoIncidente"
                value={formData.tipoIncidente}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Seleccione...</option>
                <option value="Daño Fisico">Daño Físico</option>
                <option value="Robo">Robo</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Fecha:
              </label>
              <input
                type="date"
                name="fechaInforme"
                value={formData.fechaInforme}
                disabled
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "#e9ecef",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Descripción:
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="4"
              required
              placeholder="Describa detalladamente qué sucedió..."
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "none",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "2px dashed #aaa",
              borderRadius: "8px",
              background: "#fff",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Adjuntar Documentos o Fotos:
            </label>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
<<<<<<< HEAD
              accept="image/*,application/pdf" 
              style={{ marginBottom: '10px' }}
              disabled={archivos.length >= 5}
=======
              accept="image/*,application/pdf"
              style={{ marginBottom: "10px" }}
>>>>>>> 5f6d42b (FIX: modificación de algunos archivos para utilizar Tailwind)
            />
            <small style={{ display: 'block', color: '#666', marginBottom: '10px' }}>
                          ({archivos.length}/5 archivos seleccionados)
            </small>
                        
            {archivos.length > 0 && (
<<<<<<< HEAD
                          <div style={{ background: '#eef', padding: '10px', borderRadius: '4px' }}>
                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '0.9rem' }}>
                              Archivos listos:
                            </p>
                            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
                              {archivos.map((file, index) => (
                                <li key={index} style={{ marginBottom: '5px' }}>
                                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                  <button 
                                    type="button" 
                                    onClick={() => removerArchivo(index)}
                                    style={{ 
                                      marginLeft: '10px', 
                                      border: 'none', 
                                      background: 'transparent', 
                                      color: 'red', 
                                      cursor: 'pointer',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
=======
              <div
                style={{
                  background: "#eef",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 5px 0",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  Archivos listos para subir:
                </p>
                <ul
                  style={{ margin: 0, paddingLeft: "20px", fontSize: "0.9rem" }}
                >
                  {archivos.map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
>>>>>>> 5f6d42b (FIX: modificación de algunos archivos para utilizar Tailwind)
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#ccc" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "Subiendo datos y archivos..."
              : "Guardar Informe Completo"}
          </button>
        </form>
      </div>

      <div>
<<<<<<< HEAD
        <InformesList 
                informes={informes} 
                onDescargar={descargarPDF} 
                onDescargarZIP={descargarZIP}
              />
=======
        <h2> Historial</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr
              style={{ background: "#333", color: "#fff", textAlign: "left" }}
            >
              <th style={{ padding: "10px" }}>ID</th>
              <th style={{ padding: "10px" }}>Incidente</th>
              <th style={{ padding: "10px" }}>Fecha</th>
              <th style={{ padding: "10px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((info) => (
              <tr key={info.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{info.id}</td>
                <td style={{ padding: "10px" }}>{info.tipoIncidente}</td>
                <td style={{ padding: "10px" }}>{info.fechaInforme}</td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => descargarPDF(info.id)}
                    style={{
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Descargar PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
>>>>>>> 5f6d42b (FIX: modificación de algunos archivos para utilizar Tailwind)
      </div>
    </div>
  );
};

export default Informes;
