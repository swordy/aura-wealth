import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// FOWT prevention: apply theme class before React hydration
if (localStorage.getItem("aura-theme") === "light") {
  document.documentElement.classList.add("light");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
