// src/pages/RSVP.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./RSVP.css";
import bgImg from "../assets/invite-bg.jpeg"; // match actual extension
import Particles from "../components/Particles.jsx";
import { rsvp, getGuest } from "../lib/api";

export default function RSVP() {
  const nav = useNavigate();
  const { search } = useLocation();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = new URLSearchParams(search);
    const t = q.get("g");
    if (t) {
      localStorage.setItem("guest_token", t.trim());
      (async () => {
        try {
          const data = await getGuest(t);
          setGuest(data); // { token, name, tableNumber, rsvpStatus }
        } catch (e) {
          console.error("Failed to load guest:", e);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [search]);

  const accept = async () => {
    const token = localStorage.getItem("guest_token");
    if (!token) return alert("Open your invite link that contains ?g=TOKEN.");
    try {
      const data = await rsvp({ token, response: "accept" });
      if (data.tableNumber != null) {
        localStorage.setItem("guest_table", String(data.tableNumber));
      }
      nav("/home");
    } catch (e) {
      alert(e.message || "Could not submit RSVP");
    }
  };

  const decline = async () => {
    const token = localStorage.getItem("guest_token");
    try {
      if (token) await rsvp({ token, response: "decline" });
    } catch {}
    nav("/sorry");
  };

  return (
    <section className="rsvp" style={{ "--bg": `url(${bgImg})` }}>
      <Particles count={48} />
      <div className="content">
        <h1 className="headline">RSVP</h1>

        {loading && <p>Loading guest info…</p>}
        {!loading && guest && (
          <p className="guest-name">Dear {guest.name || "Guest"},</p>
        )}
        {!loading && !guest && (
          <p className="guest-name error">Guest not found. Please check your link.</p>
        )}

        <p className="quote">
          You’re invited to our wedding on 19/08/2025 <br/>your presence will make our day sparkle ✨
        </p>

        <div className="actions">
          <button className="btn btn-primary" onClick={accept}>Accept</button>
          <button className="btn btn-ghost" onClick={decline}>Decline</button>
        </div>
      </div>
    </section>
  );
}
