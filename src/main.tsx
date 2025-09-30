import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Import DeLightPlus UI styles
// import 'delightplus-ui/styles.css';
import "delightplus-ui/dist/styles.css";
import { ThemeProvider } from 'delightplus-ui';

// Import your own Tailwind styles
import "./index.css";
import App from "./App.tsx";

// import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
