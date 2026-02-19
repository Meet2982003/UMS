import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

const ProtectedRoutes = ({ children }: any) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoutes;
