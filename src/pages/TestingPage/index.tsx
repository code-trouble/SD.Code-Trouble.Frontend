import React, { useState } from "react";
import { NavBar } from "../../components/previewNavbar";
import { AuthModal } from "../../components/AuthModal";
import { Footer } from "../../components/Footer";

export const TestingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModal = () => setIsModalOpen(!isModalOpen);
  return (
    <div className="main-wrapper">
      <NavBar />
      <div className="hero">
        <button onClick={handleModal}>Open Modal</button>
        {isModalOpen && <AuthModal type="recovery" onClose={handleModal} />}
      </div>
      <Footer />
    </div>
  );
};
