import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ErrorBoundary
 *
 * Componente para capturar errores en tiempo de ejecución y evitar
 * que la aplicación muestre una página en blanco. Exportado como named export
 * para que puedas envolver el <RouterProvider> o cualquier subtree:
 *
 * import { ErrorBoundary } from "./components/ProtectedRoute";
 *
 * <ErrorBoundary>
 *   <RouterProvider ... />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Guarda información adicional si es necesario (logging remoto, etc.)
    this.setState({ error, info });
    // Log en consola para depuración local
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, textAlign: "center" }}>
          <h2 style={{ margin: 0, color: "#0a4fa8" }}>
            Ha ocurrido un error en la aplicación
          </h2>
          <p style={{ color: "#333", marginTop: 12 }}>
            Revisa la consola para más detalles o recarga la página.
          </p>
          <details
            style={{
              marginTop: 12,
              textAlign: "left",
              maxWidth: 800,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <summary style={{ cursor: "pointer" }}>Detalles del error</summary>
            <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>
              {String(this.state.error)}
              {this.state.info ? "\n\n" + JSON.stringify(this.state.info) : ""}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * ProtectedRoute
 *
 * Envuelve rutas que requieren autenticación. Si existe un token en localStorage
 * (clave `token`) permite renderizar `children`. Si no existe, redirige a `/login`
 * preservando la ubicación previa en el estado para poder volver luego.
 *
 * Uso:
 * <ProtectedRoute><Dashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // Evitar acceso a `window` en entornos no-browser
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
