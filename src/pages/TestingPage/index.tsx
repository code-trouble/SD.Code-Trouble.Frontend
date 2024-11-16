import React from "react";
import { NavBar } from "../../components/Navbar";
import { Avatar } from "../../components/Avatar";

export const TestingPage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <NavBar />
      <div className="hero">
        <Avatar name="Professor Corrêa" role="Product Design" sizes="large" />
      </div>
    </div>
  );
};
