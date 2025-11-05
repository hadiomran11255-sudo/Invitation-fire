const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function rsvp({ token, response }) {
  const res = await fetch(`${BASE}/api/rsvp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token.trim(), response })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "RSVP failed");
  return data; // { ok, name, tableNumber, rsvpStatus }
}

export async function getGuest(token) {
  const res = await fetch(`${BASE}/api/guest/${encodeURIComponent(token.trim())}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Guest not found");
  return data; // { token, name, tableNumber, rsvpStatus }
}
