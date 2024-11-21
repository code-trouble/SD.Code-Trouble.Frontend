import React from "react";
import { Header } from "../../components/Header";

export const LandingPage: React.FC = () => {
  return (
    <div className="main-wrapper">
        <Header theme="blue" loggedIn={false}/>
    </div>
  );
};
