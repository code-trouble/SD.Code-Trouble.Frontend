import React from "react";
import { NavBar } from "../../components/Navbar";
import { AuthModal } from "../../components/AuthModal";



export const TestingPage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <NavBar />
      <div className="hero">
          <AuthModal type="signIn" />
      </div>  
    </div>
  );
};
