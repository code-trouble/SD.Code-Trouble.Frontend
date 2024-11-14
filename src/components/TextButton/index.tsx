import React from "react";

function navigateToPage() {
	window.location.href = "https://suportededomingo.com.br";
}

export const TextButton: React.FC = () => {
	return (
		<button className="text-button" onClick={navigateToPage}>
			Voltar para a Suporte de Domingo
		</button>
	);
};
