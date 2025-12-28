import React from "react";
import { Navigate, useLocation } from "react-router-dom";

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

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol"); 

  // 1. Si no hay token, al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay roles requeridos y el usuario no tiene el rol adecuado, al home
  if (allowedRoles && !allowedRoles.includes(rol)) {
    return <Navigate to="/" replace />;
  }

  // 3. Si todo está bien, renderizamos la página (children)
  return children;
}
