import React, { useEffect, useState } from "react";
import { SignIn, SignUp, ForgotPassword, RecoveryPassword } from "./Form";
import { logoCodePrimary } from "../../assets/images/svg/icons";
import { ProfessorCorrea } from "../../assets/images/svg/illustration";

interface IAuthModal {
  type: "signIn" | "signUp" | "recovery" | "forgot";
  onClose: () => void;
}

export const AuthModal: React.FC<IAuthModal> = ({ type, onClose }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderNames = () => {
    switch (type) {
      case "signIn":
        return {
          title: "Login",
          text: "Ainda não possui conta?",
          textDecoration: "Cadastrar",
        };
      case "signUp":
        return {
          title: "Cadastro",
          text: "Já possui uma conta?",
          textDecoration: "Entrar",
        };
      case "forgot":
        return {
          title: "Esqueceu a sua senha?",
          text: "Voltar ao",
          textDecoration: "Login",
        };
      case "recovery":
        return {
          title: "Recuperar senha",
          text: "Voltar ao",
          textDecoration: "Login",
        };
      default:
        return null; // Retorne `null` ou um objeto vazio, se necessário
    }
  };
  

  const renderForm = () => {
    switch (type) {
      case "signIn":
        return <SignIn />;
      case "signUp":
        return <SignUp />;
      case "forgot":
        return <ForgotPassword />;
      case "recovery":
        return <RecoveryPassword />;
      default:
        return <p>Tipo de formulário não selecionado</p>;
    }
  };

  const names = renderNames();

  return (
    <div className="overlay" onClick={onClose}>
      <dialog onClick={(e) => e.stopPropagation()}>
        {windowWidth > 1070 && (
          <figure>
            <img
              className="logo"
              src={logoCodePrimary}
              alt="logo code trouble na cor verde, primary"
            />
            <img
              className="mascote"
              src={ProfessorCorrea}
              alt="avatar do professor Corrêa"
            />
          </figure>
        )}
        <aside>
          <h1 className="modal-title">{names?.title}</h1>
          <main className="form-container">{renderForm()}</main>
          <section>
            <div className="option-container">
              <div className="option-wrapper">
                <div className="line"></div>
                <p className="option-text">ou</p>
                <div className="line"></div>
              </div>
              <p>
                {names?.text} <button>{names?.textDecoration}</button>
              </p>
            </div>
          </section>
        </aside>
      </dialog>
    </div>
  );
};
