import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import Root from "./pages/Root";
import ProtectedRoute, { ErrorBoundary } from "./components/ProtectedRoute";
import "./index.css";
import AdminEncargados from './pages/AdminEncargados'; // <--- IMPORTAR
import Informes from "./pages/Informes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "informes", element: <Informes /> },
      {
        path: "admin/encargados", // Esta será la URL: http://localhost:5173/admin/encargados
        element: (
          <ProtectedRoute> {/* Bloquea el acceso si no estás logueado */}
             <AdminEncargados />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
);
