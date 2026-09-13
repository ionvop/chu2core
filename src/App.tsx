import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CursorTrail } from "@/components/CursorTrail";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Sites } from "@/pages/Sites";

export default function App() {
  return (
    <>
      <CursorTrail />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </>
  );
}