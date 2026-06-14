import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { currUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }


  if (!currUser) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return children;
};

export default ProtectedRoute;