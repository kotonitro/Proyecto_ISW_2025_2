import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import Root from "./pages/Root";
import ProtectedRoute, { ErrorBoundary } from "./components/ProtectedRoute";
import "./index.css";
import AdminEncargados from "./pages/AdminEncargados";
import Informes from "./pages/Informes";
import Usuarios from "./pages/Usuarios";
import CustodiaPage from "./pages/CustodiaPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "usuarios", element: <Usuarios /> },
      { path: "informes", 
        element: (
          <ProtectedRoute>
            <Informes />
          </ProtectedRoute>
        ),
      },
      {
        path: "custodia",
        element: (
          <ProtectedRoute>
            <CustodiaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/encargados",
        element: (
          <ProtectedRoute>
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
