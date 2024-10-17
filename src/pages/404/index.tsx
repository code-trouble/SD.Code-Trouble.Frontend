import React from "react";
import { NavBar } from "../../components/navbar";
import { TextButton } from "../../components/textbutton";

export const ErrorPage: React.FC = () => {
	return (
		<div className="main-wrapper">
			<NavBar />
			<div className="hero">
				<h1>
					404 <span className="hide-on-mobile">-</span>
					<span className="enable-on-mobile">
						<br />
					</span>
					Page not Found
				</h1>
				<p>
					A página que está procurando não existe ou está temporariamente
					indisponível.
				</p>
				<TextButton />
			</div>
		</div>
	);
};
