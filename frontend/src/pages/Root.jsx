import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Login from "./Login";
export { default as Error404 } from "./Error404";

/**
 * Root - Versión simplificada:
 * - Muestra solo el título del proyecto y el botón "Ingresar".
 * - El botón abre un desplegable (dropdown) con el componente <Login />
 *   en lugar de navegar a otra ruta.
 *
 * El dropdown se cierra al hacer clic fuera o después de un inicio exitoso.
 */
export default function Root() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function onDocumentClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  function handleLoginSuccess(encargadoNombre) {
    // Puedes guardar el nombre/token si lo deseas; aquí solo cerramos el dropdown.
    localStorage.setItem("encargadoNombre", encargadoNombre || "");
    setOpen(false);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-gray)" }}
    >
      <header className="header-brand" style={{ position: "relative" }}>
        <div
          className="header-inner"
          style={{ justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="avatar-circle" aria-hidden="true" />
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
              Proyecto ISW
            </span>
          </div>

          {/* Solo el botón Ingresar */}
          <div style={{ position: "relative" }}>
            <button
              ref={buttonRef}
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-controls="login-dropdown"
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.16)",
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Ingresar
            </button>

            {/* Dropdown */}
            {open && (
              <div
                id="login-dropdown"
                ref={dropdownRef}
                role="dialog"
                aria-modal="false"
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: 8,
                  width: 360,
                  maxWidth: "calc(100vw - 32px)",
                  background: "#fff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  borderRadius: 10,
                  zIndex: 40,
                  overflow: "hidden",
                }}
              >
                {/* Componente de Login se renderiza aquí; se le pasa onLoginSuccess para cerrar */}
                <Login onLoginSuccess={handleLoginSuccess} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mantengo Outlet para que la app pueda renderizar rutas debajo si las hubiera */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Proyecto ISW
      </footer>
    </div>
  );
}
