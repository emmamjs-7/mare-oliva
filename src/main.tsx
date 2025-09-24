import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../sass/index.scss";
import routes from "./routes";
import App from "./App";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import type { RouteObject } from "react-router-dom";
import CreateDish from "./pages/CreateDish";
import { AuthProvider } from "./auth/AuthContext";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      ... (routes as RouteObject[]),
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "create-dish", element: <CreateDish /> }, // ✅ relativ path
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position="bottom-center" reverseOrder={false} />
  </StrictMode>
);
