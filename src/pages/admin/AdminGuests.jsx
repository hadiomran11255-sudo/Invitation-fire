import { useEffect, useState } from "react";
import "./AdminGuests.css";
import {
  adminListGuests,
  adminCreateGuest,
  adminUpdateGuest,
  adminDeleteGuest,
  adminRegenerateToken,
  adminDownloadXlsx,
} from "../../lib/adminApi";

const APP_BASE =
  (import.meta.env.VITE_APP_BASE_URL || "").replace(/\/$/, "") ||
  window.location.origin;

export default function AdminGuests() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    tableNumber: "",
    token: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setMsg("Link copied");
      setTimeout(() => setMsg(""), 1200);
    } catch {
      setMsg("Could not copy");
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminListGuests({ q, status, page, limit });
      setRows(data.rows);
      setTotal(data.total);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [page, status]);

  const create = async (e) => {
    e.preventDefault();
    try {
      await adminCreateGuest({
        ...form,
        tableNumber: Number(form.tableNumber || 0) || 0,
        token: form.token?.trim() || undefined,
      });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        tableNumber: "",
        token: "",
      });
      setMsg("Guest created");
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const update = async (id, patch) => {
    try {
      await adminUpdateGuest(id, patch);
      setMsg("Guest updated");
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this guest?")) return;
    try {
      await adminDeleteGuest(id);
      setMsg("Guest deleted");
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const regen = async (id) => {
    if (!confirm("Regenerate token? The old link will stop working.")) return;
    try {
      const res = await adminRegenerateToken(id);
      setMsg(`New token: ${res.token}`);
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="admin-wrap">
      <header>
        <h1>Guests Manager</h1>
        <div className="controls">
          <button
            onClick={async () => {
              try {
                await adminDownloadXlsx();
              } catch (e) {
                setMsg(e.message);
              }
            }}
          > 
            Export XLSX
          </button>
          <input
            placeholder="Search name/email/phone/token"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
          <button
            onClick={() => {
              setPage(1);
              load();
            }}
          >
            Search
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_key");
              window.location.href = "/admin/login";
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {msg && <div className="flash">{msg}</div>}
      {loading && <div className="flash">Loading…</div>}

      <section className="grid">
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Invite Link</th>
              <th>Name</th>
              <th>Table</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const link = `${APP_BASE}/?g=${encodeURIComponent(r.token)}`;
              return (
                <tr key={r._id}>
                  <td className="mono">{r.token}</td>

                  {/* New: auto-generated link column */}

                  {/* Existing: Invite Link with Copy button */}
                  <td className="linkcell">
                    <a href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                    <button
                      className="smallbtn"
                      onClick={() => copy(link)}
                      title="Copy link"
                    >
                      Copy
                    </button>
                  </td>

                  <td>
                    {r.firstName} {r.lastName}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={r.tableNumber ?? 0}
                      onChange={(e) =>
                        update(r._id, {
                          tableNumber: Number(e.target.value || 0),
                        })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={r.rsvpStatus}
                      onChange={(e) =>
                        update(r._id, { rsvpStatus: e.target.value })
                      }
                    >
                      <option value="pending">pending</option>
                      <option value="accepted">accepted</option>
                      <option value="declined">declined</option>
                    </select>
                  </td>

                  <td className="actions">
                    <button onClick={() => regen(r._id)}>New Token</button>
                    <button onClick={() => del(r._id)} className="danger">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  No guests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <footer className="pager">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </footer>

      <section className="create">
        <h2>Add Guest</h2>
        <form onSubmit={create} className="form">
          <input
            placeholder="First name"
            value={form.firstName}
            onChange={(e) =>
              setForm((f) => ({ ...f, firstName: e.target.value }))
            }
          />
          <input
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) =>
              setForm((f) => ({ ...f, lastName: e.target.value }))
            }
          />

          <input
            placeholder="Table #"
            type="number"
            value={form.tableNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, tableNumber: e.target.value }))
            }
          />

          <button type="submit">Create</button>
        </form>
      </section>
    </div>
  );
}
