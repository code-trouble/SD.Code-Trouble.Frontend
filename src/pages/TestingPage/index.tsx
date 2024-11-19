import React from "react";
import { StackedCards } from "../../components/TeamStackedCard/StackedCards";
import { OldNavbar } from "../../components/oldNavbar";



export const TestingPage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <OldNavbar/>
      <div className="hero">
        <StackedCards/>
      </div>  
    </div>
  );
};
