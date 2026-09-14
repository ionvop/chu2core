import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App";

// Derive the router basename from the current URL so the app works when
// served from any subdirectory (e.g. /home/), not just the domain root.
// All routes are single-segment, so the basename is the current path with
// the trailing route segment stripped (falls back to "/" at the root).
const basename = window.location.pathname.replace(/\/[^/]*$/, "") || "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);