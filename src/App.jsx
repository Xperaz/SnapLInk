import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Signup from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Link from "./pages/Link";
import RedirectLink from "./pages/RedirectLink";
import UserProvider from "./context/userContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { Analytics } from "@vercel/analytics/react";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "auth",
        element: <Signup />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "link/:id",
        element: (
          <ProtectedRoute>
            <Link />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:id",
        element: <RedirectLink />,
      },
    ],
  },
]);
const App = () => {
  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
      <Analytics />
    </>
  );
};

export default App;
