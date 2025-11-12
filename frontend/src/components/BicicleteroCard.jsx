import React from "react";

/**
 * BicicleteroCard
 *
 * Usa clases CSS del proyecto definidas en `src/index.css`:
 * - .bicicletero-card
 * - .bicicletero-image
 * - .bicicletero-panel
 * - .bicicletero-title
 * - .bicicletero-text
 * - .bicicletero-capacity
 *
 * Props:
 * - title: string
 * - location: string
 * - capacity: string
 * - image: string (url or import)
 * - onClick: function (opcional) para manejar clicks
 */
export default function BicicleteroCard({
  title,
  location,
  capacity,
  image,
  onClick,
}) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=80&auto=format&fit=crop&s=placeholder";

  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className="bicicletero-card"
      role={onClick ? "button" : undefined}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={title ? `Ver ${title}` : "Bicicletero"}
    >
      <div className="bicicletero-image">
        <img src={image || fallbackImage} alt={title || "Bicicletero"} />
      </div>

      <div className="bicicletero-panel">
        <h3 className="bicicletero-title">{title}</h3>
        <p className="bicicletero-text">{location}</p>
        <p className="bicicletero-text" style={{ marginTop: 8 }}>
          Capacidad
        </p>
        <p className="bicicletero-capacity">{capacity}</p>
      </div>
    </div>
  );
}
