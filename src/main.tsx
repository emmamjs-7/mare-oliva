import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../sass/index.scss";
import routes from "./routes";
import App from "./App";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import type { RouteObject } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { menuItemAction } from "./utils/menuItemAction";
import MenuItemEditor from "./pages/MenuItemEditor";
import { menuItemLoader } from "./utils/menuItemLoader";
import AdminBookingsPage from "./pages/AdminBookingPage";
import MyBookingPage from "./pages/MyBookingPage";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('service worker registered', reg))
    .catch(err => console.log('service worker not registered', err));
}

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
          { path: "create-dish", element: <MenuItemEditor /> },
          { path: "menu/:id/edit", element: <MenuItemEditor />, loader: menuItemLoader },
          { path: "adminbooking", element: <AdminBookingsPage /> },


        ],

      },
      { path: "mypage", element: <MyBookingPage />, },
      { path: "menu/:id", action: menuItemAction },
    ],
  },
  {
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position="bottom-center" reverseOrder={false} />
  </StrictMode>
);
