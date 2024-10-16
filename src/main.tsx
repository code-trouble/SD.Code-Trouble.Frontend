import './styles/sass/main.scss';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';



import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
