import React, { useState } from "react";
import { NavBar } from "../../components/previewNavbar";
import { AuthModal } from "../../components/AuthModal";

export const TestingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModal = () => setIsModalOpen(!isModalOpen);
  return (
    <div className="main-wrapper">
      <OldNavbar/>
      <div className="hero">
        <button onClick={handleModal}>Open Modal</button>
        {isModalOpen && <AuthModal type="recovery" onClose={handleModal} />}
      </div>
    </div>
  );
};
