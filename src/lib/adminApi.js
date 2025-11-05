const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function adminHeaders() {
  const key = sessionStorage.getItem("admin_key") || "";
  return { "Content-Type": "application/json", "x-admin-key": key };
}

export async function adminListGuests({
  q = "",
  page = 1,
  limit = 20,
  status = "",
} = {}) {
  const u = new URL(`${BASE}/api/admin/guests`);
  if (q) u.searchParams.set("q", q);
  if (status) u.searchParams.set("status", status);
  u.searchParams.set("page", page);
  u.searchParams.set("limit", limit);
  const res = await fetch(u, { headers: adminHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load guests");
  return data;
}

export async function adminCreateGuest(payload) {
  const res = await fetch(`${BASE}/api/admin/guests`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Create failed");
  return data;
}

export async function adminUpdateGuest(id, payload) {
  const res = await fetch(`${BASE}/api/admin/guests/${id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update failed");
  return data;
}

export async function adminDeleteGuest(id) {
  const res = await fetch(`${BASE}/api/admin/guests/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Delete failed");
  return data;
}

export async function adminRegenerateToken(id) {
  const res = await fetch(`${BASE}/api/admin/guests/${id}/regenerate-token`, {
    method: "POST",
    headers: adminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Token regen failed");
  return data;
}

export async function adminSummary() {
  const res = await fetch(`${BASE}/api/admin/summary`, {
    headers: adminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Summary failed");
  return data;
}
export async function adminDownloadXlsx() {
  const res = await fetch(`${BASE}/api/admin/export/xlsx`, {
    headers: adminHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Export XLSX failed");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "invite-links.xlsx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
