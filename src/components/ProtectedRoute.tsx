import { authService } from "@/services/common/authService";
import { Navigate } from "react-router-dom";


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return
    <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
