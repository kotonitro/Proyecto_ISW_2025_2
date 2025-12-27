import React, { useEffect, useState } from "react";
import BicicleteroCard from "../components/BicicleteroCard";
import axios from "axios";

// Importación de imágenes locales
import bike1 from "../images/bike1.jpg";
import bike2 from "../images/bike2.jpg";
import bike3 from "../images/bike3.jpg";
import bike4 from "../images/bike4.jpg";

// Mapeo para asignar la imagen correcta según el ID que venga de la DB
const imageMap = {
  1: bike1,
  2: bike2,
  3: bike3,
  4: bike4
};

export default function Home() {
  const [bicicleteros, setBicicleteros] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDisponibilidad = async () => {
    try {
      // Llamada a la nueva ruta del backend
      const res = await axios.get("http://localhost:3000/api/bicicleteros/disponibilidad");
      console.log("Datos recibidos:", res.data);
      // Ajustamos según la estructura de handleSuccess (res.data.data)
      if (res.data && res.data.data) {
        setBicicleteros(res.data.data);
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisponibilidad();
    
    // Polling: Actualiza los datos cada 10 segundos para que sea "en vivo"
    const interval = setInterval(fetchDisponibilidad, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
          Bicicleteros Disponibles
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {bicicleteros.length > 0 ? (
            bicicleteros.map((b) => (
              <BicicleteroCard
                key={b.id}
                title={b.title}
                location={b.location}
                // Mostramos la capacidad dinámica calculada en el backend
                capacity={`${b.ocupados} / ${b.total}`}
                image={imageMap[b.id] || bike1}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No se encontraron bicicleteros configurados en el sistema.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}