import React from "react";
import { NavBar } from "../../components/previewNavbar";
import { TextButton } from "../../components/TextButton";
import { ReactTyped } from "react-typed";

export const ComingSoonPage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <OldNavbar/>

      <div className="hero">
        <ReactTyped
          className="title"
          strings={["Coming soon!"]}
          typeSpeed={60}
          showCursor={false}
        />
        <ReactTyped
          className="subtitle"
          strings={["Estamos cozinhando algo, de devs para devs"]}
          typeSpeed={45}
          showCursor
        />
        <TextButton />
      </div>
    </div>
  );
};
