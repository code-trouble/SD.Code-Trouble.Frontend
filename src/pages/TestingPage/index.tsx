import React, { useState } from "react";
import { OldNavbar } from "../../components/previewNavbar";

import { Footer } from "../../components/Footer";

export const TestingPage: React.FC = () => {

  return (
    <div className="main-wrapper">
      <OldNavbar/>

      <Footer />
    </div>
  );
};
