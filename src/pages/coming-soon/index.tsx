import React from "react";
import { NavBar } from "../../components/navbar";
import { TextButton } from "../../components/textbutton";
import { ReactTyped } from "react-typed";

export const ComingSoonPage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <NavBar />

      <div className="hero">
        <ReactTyped
          className="title"
          strings={["Coming soon!"]}
          typeSpeed={60}
          showCursor={false}
        />
        <ReactTyped
          className="subtitle"
          strings={["Estamos cozinhando algo de devs para devs"]}
          typeSpeed={45}
          showCursor={false}
        />
        <TextButton />
      </div>
    </div>
  );
};
