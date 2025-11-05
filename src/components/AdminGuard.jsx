import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const key = sessionStorage.getItem("admin_key");
  if (!key) return <Navigate to="/admin/login" replace />;
  return children;
}
