import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../Firebase/config";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true); // wait until Firebase initializes
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;
