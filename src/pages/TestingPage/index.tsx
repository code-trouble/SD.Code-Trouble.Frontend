import React from "react";
import { NavBar } from "../../components/Navbar";
import { StackedCard } from "../../components/StackedCard";

export const TestingPage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <NavBar />
      <div className="hero">
        <StackedCard/>
      </div>
    </div>
  );
};
