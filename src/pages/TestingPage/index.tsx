import React from "react";
import { OldNavbar } from "../../components/previewNavbar";
import { StackedCards } from "../../components/StackedCards";


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
