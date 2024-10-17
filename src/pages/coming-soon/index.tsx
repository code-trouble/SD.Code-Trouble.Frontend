import React from "react";
import { NavBar } from "../../components/navbar";
import { TextButton } from "../../components/textbutton";

export const ComingSoonPage: React.FC = () => {
	return (
		<div className="main-wrapper">
			<NavBar />
			<div className="hero">
				<h1> Coming soon! </h1>
				<p>Estamos cozinhando algo. de devs para devs</p>
				<TextButton />
			</div>
		</div>
	);
};
