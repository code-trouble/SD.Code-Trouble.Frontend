import React, { useState } from "react";
import code from "../../assets/images/svg/codeLogo.svg"
import codeBlue from "../../assets/images/svg/codeLogoBlue.svg"
import smallCode from "../../assets/images/svg/smCodeLogo.svg"
import smallCodeBlue from "../../assets/images/svg/smCodeLogoBlue.svg"
import lupa from "../../assets/images/svg/lupaGlass.svg"
import burger from "../../assets/images/svg/burgerMenu.svg"
import closeX from "../../assets/images/svg/closeMenu.svg"
import home from "../../assets/images/svg/home.svg"
import questions from "../../assets/images/svg/questions.svg"
import notifications from "../../assets/images/svg/notifications.svg"
import blog from "../../assets/images/svg/blog.svg"
import sair from "../../assets/images/svg/sair.svg"
import { Avatar } from "../Avatar";

interface IHeader {
  theme?: 'base' | 'blue';
  loggedIn?: boolean;
}


export const Header: React.FC<IHeader> = ({theme, loggedIn}) => {

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header-container">
      <div className="logo-container">
        <img 
        className="normal-logo" 
        src={theme === 'base' ? code : codeBlue} 
        alt="code-logo"
        />

        <img 
        className="small-logo" 
        src={theme === 'base' ? smallCode : smallCodeBlue} 
        alt="code-logo"
        />
      </div>
      
      <div className="nav-links">
        <a href="">Home</a>
        <a href="">Blog</a>
        <a href="">Questões</a>
      </div>

      <div className="searchBar">
        <img  src={lupa} alt="lupa"/>
        <input type="text" placeholder="Pesquisar"/>
      </div>
     

      <div>
        {loggedIn ? (
          <div className="loggedInContent">
            <Avatar sizes="medium" />
            <img className="NotificationBell" src={notifications}/>
          </div>
        ) : (
          <div className="authButtons">
            <button className={theme === 'base' ? "login" : "loginBlue"}>Login</button>
            <button className={theme === 'base' ? "cadastro" : "cadastroBlue"}>Cadastro</button>
          </div>
        )}
      </div>


      {/* HAMBURGUER MENU */}
      <div className="burguer-div" onClick={toggleMenu}>
        <img className="hamburger" src={burger} alt="burger menu"/>
      
        {menuOpen && (
          <>
            <div
              className={`background-overlay ${menuOpen ? "visible" : ""}`}
              onClick={toggleMenu}
            ></div>
            <div className={`hamburger-menu ${menuOpen ? "open" : ""}`}>
              <div className="auth-buttons">
              {loggedIn ? (
                <div className="BurgerloggedInContent">
                  <Avatar sizes="medium"/>
                  <div className="burgerLoggedText">
                    <h1>Joana Lima</h1> 
                    <p className={theme === 'base' ? "verPerfil" : "verPerfilBlue"}>Ver Perfil</p>
                  </div>
                </div>
              ) : (
                <div className="auth-col">
                  <button className={theme === 'base' ? "login" : "loginBlue"}>Entrar</button>
                  <button className={theme === 'base' ? "cadastro" : "cadastroBlue"}>Cadastro</button>
                </div>
              )}
                <img src={closeX} alt="" onClick={toggleMenu} />
              </div>
              <div className="nav-links-column">
                <a className="icon-with-a" href="">
                  <img src={home} alt="" /> Home
                </a>
                <a className="icon-with-a" href="">
                  <img src={questions} alt="" /> Perguntas
                </a>
                <a className="icon-with-a" href="">
                  <img src={blog} alt="" /> Blog
                </a>
                {loggedIn ? (
                  <a className="icon-with-a sair" href="">
                    <img src={sair} alt="" /> Sair
                  </a>
                ): ( 
                  ""
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
