import React from "react";
import { NavBar } from "../../components/Navbar";
import { StackedCards } from "../../components/TeamStackedCard/StackedCards";




export const TestingPage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <NavBar />
      <div className="hero">
          <StackedCards />
      </div>  
    </div>
  );
};
