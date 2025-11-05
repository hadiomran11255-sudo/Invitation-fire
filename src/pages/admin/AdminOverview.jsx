// src/pages/admin/AdminOverview.jsx
import { useEffect, useState } from "react";
import "./AdminOverview.css";
import { adminSummary, adminListGuests } from "../../lib/adminApi";

export default function AdminOverview() {
  const [summary, setSummary] = useState({ byStatus: [], byTable: [] });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const s = await adminSummary();
      setSummary(s);
      const all = await adminListGuests({ page:1, limit:500 }); // simple big page
      setRows(all.rows);
    })().catch(console.error);
  }, []);

  return (
    <div className="admin-ov">
      <header>
        <h1>Invitations Overview</h1>
        <div className="right">
          <a href="/admin/guests">Manage Guests</a>
          <button onClick={()=>{ sessionStorage.removeItem("admin_key"); window.location.href="/admin/login";}}>Logout</button>
        </div>
      </header>

      <section className="cards">
        <div className="card">
          <h3>Status</h3>
          <ul>
            {summary.byStatus.map(s => (
              <li key={s._id || "none"}>
                <strong>{s._id || "unknown"}</strong>
                <span>{s.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Tables</h3>
          <ul className="tables">
            {summary.byTable.map(t => (
              <li key={t._id}><strong>Table {t._id}</strong><span>{t.count}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="list">
        <h2>All Guests</h2>
        <table>
          <thead>
            <tr>
              <th>Token</th><th>Name</th><th>Table</th><th>Status</th><th>Email</th><th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id}>
                <td>{r.token}</td>
                <td>{r.firstName} {r.lastName}</td>
                <td>{r.tableNumber ?? "-"}</td>
                <td>{r.rsvpStatus}</td>
                <td>{r.email || "-"}</td>
                <td>{r.phone || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
