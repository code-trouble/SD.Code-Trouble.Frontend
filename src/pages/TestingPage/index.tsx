import React from "react";
import { NavBar } from "../../components/Navbar";
import { ToggleButton } from "../../components/ToggleButton";



export const TestingPage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <NavBar />
      <div className="hero">
          <ToggleButton activeColor="" />
          <ToggleButton activeColor="#2DBA4F" />
          <ToggleButton activeColor="#FF8E00" />
          <ToggleButton activeColor="#3348A4" />
          <ToggleButton activeColor="" 
                        isDisabled={true}
          />
      </div>  
    </div>
  );
};
