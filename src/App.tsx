import { Routes, Route } from "react-router-dom";  // Importando o React Router
import { ErrorPage } from "./pages/404";
import { ComingSoonPage } from "./pages/ComingSoon";
import { TestingPage } from "./pages/TestingPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ComingSoonPage />} />        {/* Página principal */}
        <Route path="/coming-soon" element={<ComingSoonPage />} /> {/* Outra página */}
        <Route path="*" element={<ErrorPage />} />              {/* Página 404 */}
        <Route path="testandoComponente" element={<TestingPage />} />              {/* Página 404 */}
      </Routes>
    </>
  );
}
