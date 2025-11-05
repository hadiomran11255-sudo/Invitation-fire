// src/pages/Home.jsx
import { useEffect, useState } from "react";
import "./Home.css";
import bgImg from "../assets/invite-bg.jpeg";
import QR from "../components/QR.jsx";
import Particles from "../components/Particles.jsx";
import { getGuest } from "../lib/api";

export default function Home() {
  const [table, setTable] = useState(localStorage.getItem("guest_table") || "");

  useEffect(() => {
    if (table) return;
    const token = localStorage.getItem("guest_token");
    if (!token) return;
    (async () => {
      try {
        const g = await getGuest(token);
        if (g?.tableNumber != null) {
          const t = String(g.tableNumber);
          setTable(t);
          localStorage.setItem("guest_table", t);
        }
      } catch {}
    })();
  }, [table]);

  const LOCATION_URL = "https://maps.google.com/?q=Roche%20D'oree";

  return (
    <section className="invite" style={{ "--bg": `url(${bgImg})` }}>
      <Particles count={48} />

      <div className="content">
        <h1 className="save-date">
          <span className="save">Save</span>
          <span className="the">The</span>
          <span className="date">Date</span>
        </h1>

        <p className="small-cap">THE WEDDING OFF</p>

        <h2 className="names">Samira &amp; Khodor</h2>

        <div className="rule"></div>

        <p className="datetime">19 August 2025 – 8:00 pm</p>

        <p className="venue">Roche D’oree</p>

        <div className="qr-wrap">
          <QR value={LOCATION_URL} size={180} />
        </div>

        {/* Last row — only the table number from DB */}
        <p className="table">You’re on table number {table || "—"}</p>
      </div>
    </section>
  );
}
