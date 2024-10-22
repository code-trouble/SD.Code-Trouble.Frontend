// Importando o CSS global
import './styles/sass/main.scss';

// Importando as fontes princípais
import 'typeface-montserrat';
import 'typeface-lora';
import 'typeface-hind';

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // Importando o BrowserRouter
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
