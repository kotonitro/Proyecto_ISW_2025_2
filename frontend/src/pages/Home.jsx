import React from "react";
import BicicleteroCard from "../components/BicicleteroCard";
import bike1 from "../images/bike1.jpg";
import bike2 from "../images/bike2.jpg";
import bike3 from "../images/bike3.jpg";
import bike4 from "../images/bike4.jpg";

const mockData = [
  {
    id: 1,
    title: "Bicicletero 1",
    location: "Ubicado en Av. Principal 123",
    capacity: "12 / 20",
    image: bike1,
  },
  {
    id: 2,
    title: "Bicicletero 2",
    location: "Ubicado en Plaza Central",
    capacity: "8 / 12",
    image: bike2,
  },
  {
    id: 3,
    title: "Bicicletero 3",
    location: "Ubicado en Parque Norte",
    capacity: "10 / 15",
    image: bike3,
  },
  {
    id: 4,
    title: "Bicicletero 4",
    location: "Ubicado en Calle Secundaria",
    capacity: "6 / 10",
    image: bike4,
  },
];

export default function Home() {
  return (
    <div>
      {/* Main content */}
      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
          Bicicleteros Disponibles
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mockData.map((b) => (
            <BicicleteroCard
              key={b.id}
              title={b.title}
              location={b.location}
              capacity={b.capacity}
              image={b.image}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
