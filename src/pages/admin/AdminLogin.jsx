// src/pages/admin/AdminLogin.jsx
import { useState } from "react";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [key, setKey] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!key.trim()) return;
    sessionStorage.setItem("admin_key", key.trim());
    window.location.href = "/admin/guests"; // go to guests manager
  };

  return (
    <div className="admin-login">
      <form onSubmit={submit} className="panel">
        <h1>Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}
