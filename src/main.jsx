import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import Advertise_home from "./Components/Advertise/Advertise_home";
import AuthForm from "./Components/Auth/AuthForm";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> }, // Public page
      { path: "/auth", element: <AuthForm /> }, // Login/Register page
      { 
        path: "/about", 
        element: (
          <PrivateRoute>
            <About />
          </PrivateRoute>
        ) 
      },
      { 
        path: "/advertise", 
        element: (
          <PrivateRoute>
            <Advertise_home />
          </PrivateRoute>
        ) 
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
