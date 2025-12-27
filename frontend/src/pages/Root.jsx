import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import logoUBB from "../images/logoUBB.webp";

export default function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const nombre = localStorage.getItem("nombre");

  // Estado para controlar la visibilidad de la Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cerrar sidebar automáticamente al cambiar de ruta
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen font-sans text-gray-900 overflow-hidden">

      <header className="bg-blue-700 text-white shadow-md z-30 shrink-0 h-18">
        <div className="w-full px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">

            {token && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isSidebarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            )}

            <Link to="/" className="no-underline flex items-center gap-3 group">
              <img src={logoUBB} alt="Logo UBB" className="h-10 w-auto" />
              <span className="text-white text-xl font-bold group-hover:text-blue-100 transition-colors">
                Bicicleteros UBB
              </span>
            </Link>
          </div>

          <nav className="flex gap-4 items-center">

            {!token && location.pathname !== "/login" && (
              <div className="flex items-center gap-4">
                <span className="text-white text-sm font-medium hidden sm:block">
                  ¿Eres encargado?
                </span>
                <Link
                  to="/login"
                  className="bg-white text-blue-700 border border-white/40 py-2 px-4 rounded-lg no-underline font-semibold hover:bg-gray-100 transition-colors text-sm"
                >
                  Ingresar
                </Link>
              </div>
            )}

            {token && (
              <>
                <span className="text-sm font-medium text-white hidden sm:inline-block">
                  ¡Hola, {nombre}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white border-none py-2 px-4 rounded-lg cursor-pointer font-semibold hover:bg-red-700 transition-colors text-sm"
                >
                  Salir
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {token && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {token && (
          <aside
            className={`
                          bg-blue-900 text-white z-40 transition-transform duration-300 ease-in-out
                          absolute top-0 left-0 h-full w-64 shadow-xl
                          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        `}
          >
            <div className="w-64 h-full">
              <Sidebar role={rol} />
            </div>
          </aside>
        )}
        <main className="flex-1 overflow-y-auto p-6 bg-blue-50 scroll-smooth w-full">
          {token && (
            <div className="mb-4 pb-4">
            </div>
          )}

          <Outlet />

          <footer className="py-8 text-center text-sm text-gray-500 mt-auto">
            © {new Date().getFullYear()} Universidad del Bío-Bío
          </footer>
        </main>
      </div>
    </div>
  );
}
