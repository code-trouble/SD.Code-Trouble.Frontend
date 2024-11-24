import React, { useState } from "react";
import { NavBar } from "../../components/previewNavbar";
import { AuthModal } from "../../components/AuthModal";
import { Footer } from "../../components/Footer";

export const TestingPage: React.FC = () => {

  return (
    <div className="main-wrapper">
      <OldNavbar/>
      <div className="hero">
        <button onClick={handleModal}>Open Modal</button>
        {isModalOpen && <AuthModal type="recovery" onClose={handleModal} />}
      </div>
      <Footer />
    </div>
  );
};
