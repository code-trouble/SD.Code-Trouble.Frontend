import React from "react";
import { NavBar } from "../../components/Navbar";
import { ToggleButtons } from "../../components/TeamToggleButton/ToggleButtons";



export const TestingPage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <NavBar />
      <div className="hero">
          <ToggleButtons />
      </div>  
    </div>
  );
};
