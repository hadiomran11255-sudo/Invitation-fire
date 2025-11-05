import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import RSVP from "./pages/RSVP.jsx";
import Decline from "./pages/Decline.jsx";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminGuests from "./pages/admin/AdminGuests.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminGuard from "./components/AdminGuard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<RSVP />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sorry" element={<Decline />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/guests"
          element={<AdminGuard><AdminGuests /></AdminGuard>}
        />
        <Route
          path="/admin/overview"
          element={<AdminGuard><AdminOverview /></AdminGuard>}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
