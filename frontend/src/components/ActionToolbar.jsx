import React from "react";
import SearchBar from "./SearchBar";
import ActionButton from "./ActionButton";

export default function ActionToolbar({ 
  busqueda, 
  setBusqueda, 
  placeholder, 
  buttonText, 
  onClick,
  buttonColor, 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
      
      {/*Barra de búsqueda*/}
      <SearchBar 
        value={busqueda} 
        onChange={(e) => setBusqueda(e.target.value)} 
        placeholder={placeholder}
      />

      {/*Botón*/}
      <ActionButton 
        onClick={onClick} 
        text={buttonText} 
        color={buttonColor} 
      />

    </div>
  );
}