import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// React95 global styles + theme (Win95 base, overridden by our pastel theme)
import "@react95/core/GlobalStyle";
import "@react95/core/themes/win95.css";

import "./index.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);