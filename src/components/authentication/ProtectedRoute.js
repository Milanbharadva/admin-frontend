import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { getLocalStorage, getRoutePath } from "../../global";

export const ProtectedRoute = ({ children }) => {
  // const location = useLocation();
  // const token = getLocalStorage("token");
  // const userData = getLocalStorage("userData");

  // if (!userData) {
  //   return <Navigate to={getRoutePath("login")} replace />;
  // }
  // const permissionData = JSON.parse(userData).permissions;
  // let pathName = location.pathname.split("/").slice(2).join("-");
  // if (pathName.includes("edit")) {
  //   let pathArray = pathName.split("-");
  //   pathArray.pop();
  //   pathName = pathArray.join("-");
  // }
  // let hasPermission = permissionData.some((item) => {
  //   if (pathName === "dashboard") {
  //     return true;
  //   }
  //   return item.slug === `${pathName}-list` || item.slug === pathName;
  // });
  // if (
  //   location.pathname.endsWith("admin") ||
  //   location.pathname.endsWith("admin/")
  // ) {
  //   hasPermission = true;
  // }

  // if (!hasPermission) {
  //   return <Navigate to={getRoutePath("404")} replace />;
  // }

  // if (!token) {
  //   return <Navigate to={getRoutePath("login")} replace />;
  // }

  return children;
};

export default ProtectedRoute;
