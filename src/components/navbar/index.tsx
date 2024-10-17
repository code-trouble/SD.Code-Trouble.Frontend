import React from "react";

export const NavBar: React.FC = () => {
	const codeBrackets = "{code}";

	return (
		<div className="navbar">
			<p>{codeBrackets} trouble </p>
			<p>Suporte de Domingo</p>
		</div>
	);
};
