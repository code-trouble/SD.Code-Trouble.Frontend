import React from "react";
import { NavBar } from "../../components/navbar";
import { TextButton } from "../../components/textbutton";
import { ReactTyped } from "react-typed";

export const ErrorPage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <NavBar />
      <div className="hero">
        <h1 className="title">
          404 <span className="hide-on-mobile">-</span>
          <span className="enable-on-mobile">
            <br />
          </span>
          Page not Found
        </h1>
        <ReactTyped
          className="subtitle"
          strings={[
            "A página que está procurando não existe ou está temporariamente indisponível.",
          ]}
          typeSpeed={45}
          showCursor={false}
        />
        <TextButton />
      </div>
    </div>
  );
};
