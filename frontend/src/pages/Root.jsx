import React from "react";
// 1. AGREGAMOS 'useLocation' AQUI
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Root() {
  const navigate = useNavigate();
  const location = useLocation(); // 2. OBTENEMOS LA URL ACTUAL

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-gray)" }}
    >
      <header className="header-brand">
        <div
          className="header-inner"
          style={{ justifyContent: "space-between", padding: "0 20px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="avatar-circle" aria-hidden="true" />
                <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
                Proyecto ISW
                </span>
            </Link>
          </div>

          <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            
            {token && (
              <>
                <Link to="/custodia" style={{ color: "#fff", textDecoration: "none" }}>Custodia</Link>
              </>
            )}

            {token && rol === "admin" && (
              <>
                <Link to="/admin/encargados" style={{ color: "#ddd", textDecoration: "none" }}>
                  Admin Encargados
                </Link>
                <Link to="/admin/bicicleteros" style={{ color: "#ddd", textDecoration: "none" }}>
                  Admin Bicicleteros
                </Link>
              </>
            )}

            {/* BOTÓN DE INGRESAR / SALIR */}
            {token ? (
              <button
                onClick={handleLogout}
                style={{
                    background: "rgba(255, 0, 0, 0.6)",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                }}
              >
                Salir
              </button>
            ) : (
              // 3. LA CONDICIÓN MÁGICA:
              // Solo mostramos el botón si NO estamos ya en "/login"
              location.pathname !== "/login" && (
                <Link
                    to="/login"
                    style={{
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.4)",
                    padding: "8px 14px",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600,
                    }}
                >
                    Ingresar
                </Link>
              )
            )}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Proyecto ISW
      </footer>
    </div>
  );
}