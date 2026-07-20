// Importando o CSS global
import "./styles/sass/main.scss";

// Importando as fontes princípais
import "typeface-montserrat";
import "typeface-lora";
import "typeface-hind";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importando o BrowserRouter
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { initApiLayer } from "./services/api.setup.ts";
import { queryClient } from "./lib/queryClient.ts";

initApiLayer();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
