import { motion } from "framer-motion";
import React from "react";

export const OldNavbar: React.FC = () => {
  const codeBrackets = "{code}";

  return (
    <motion.div
      initial={{ y: "-100vh" }} // Começa fora da tela na parte superior
      animate={{ y: 0 }} // Anima para a posição original
      transition={{ type: "spring", stiffness: 50, damping: 10 }} // Animação suave de mola
    >
      <div className="navbar">
        <p>{codeBrackets} trouble </p>
        <p>Suporte de Domingo</p>
      </div>
    </motion.div>
  );
};
