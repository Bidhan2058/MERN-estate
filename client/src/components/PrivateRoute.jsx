import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute({children}) {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? children: <Navigate to="/signin" />;
}

export default PrivateRoute;
