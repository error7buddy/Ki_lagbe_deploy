import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/config";

import App from "./App";
import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import Advertise_home from "./Components/Advertise/Advertise_home";
import AuthForm from "./Components/Auth/AuthForm";
import Login from "./Components/Auth/Login";   // ✅ Admin login page
import AdminPage from "./Components/Admin/AdminPage"; // ✅ Admin panel
import "./index.css";
import Shifting from "./Components/Shifting/Shifting";

// Protected Route (for advertise)
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return user ? children : <Navigate to="/auth" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "about", element: <About /> },
      {
        path: "advertise",
        element: (
          <ProtectedRoute>
            <Advertise_home />
          </ProtectedRoute>
        ),
      },
      { path: "shifting", element: <Shifting /> },
      { path: "auth", element: <AuthForm /> },
      { path: "login", element: <Login /> },        // 👈 Admin Login page
      { path: "admin", element: <AdminPage /> },    // 👈 Admin Dashboard
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
