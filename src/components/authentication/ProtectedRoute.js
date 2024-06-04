import { Navigate } from "react-router-dom";
import { getLocalStorage, getRoutePath } from "../../global";

export const ProtectedRoute = ({ children }) => {
  const token = getLocalStorage("token");
  if (!token) {
    return <Navigate to={getRoutePath("login")} />;
  }
  return children;
};
export default ProtectedRoute;
