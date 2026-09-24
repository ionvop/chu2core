import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CursorTrail } from "@/components/CursorTrail";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Sites } from "@/pages/Sites";
import { Jail } from "@/pages/Jail";

/**
 * Wraps the normal site pages in the shared chrome (nav header + footer).
 * The naughty corner (`/jail`) deliberately sits OUTSIDE this layout so it
 * feels like being sent away from the rest of the site.
 */
function SiteLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return (
    <>
      <CursorTrail />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sites" element={<Sites />} />
        </Route>
        <Route path="/jail" element={<Jail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}