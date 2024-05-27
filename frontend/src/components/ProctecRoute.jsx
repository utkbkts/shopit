import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";
const ProctecRoute = ({ children, admin }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (loading) {
      <Loader />;
    }
  }, []);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }
  if (admin && user?.role !== "admin") {
    return <Navigate to={"/login"} replace />;
  }
  return children;
};

export default ProctecRoute;
