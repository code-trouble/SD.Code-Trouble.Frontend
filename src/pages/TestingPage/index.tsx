import React from "react";
import { OldNavbar } from "../../components/previewNavbar";
import CustomButton from "../../components/CustomButton";
import buttonArrow from "../../assets/images/svg/buttonArrow.svg"

export const TestingPage: React.FC = () => {

  return (
    <div className="main-wrapper">
      <OldNavbar/>
      <div className="hero">
        <CustomButton 
        text="Cadastro"
        padding="8px 90px"
        color="white" 
        backgroundColor="#2DBA4F"
        fontSize="18px"
        fontWeight="500"
        />

        <CustomButton 
        text="Visitar a comunidade"
        padding="9.5px"
        color="#3348A4" 
        backgroundColor="transparent"
        fontSize="18px"
        fontWeight="500"
        icon={buttonArrow}
        />

        <CustomButton 
        text="Visitar Blog"
        padding="9.5px 80px"
        color="white" 
        backgroundColor="#3348A4"
        fontSize="18px"
        fontWeight="500"
        />

      </div>  
    </div>
  );
};
