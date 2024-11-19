import React from "react";
import code from "../../assets/images/svg/codeLogo.svg"
import smallCode from "../../assets/images/svg/smCodeLogo.svg"
import lupa from "../../assets/images/svg/lupaGlass.svg"
import burger from "../../assets/images/svg/burgerMenu.svg"
 

export const Navbar: React.FC = () => {

  return (
    <header>
      
      <div className="logo-container">
        <img className="normal-logo" src={code} alt="code-logo"/>
        <img className="small-logo" src={smallCode} alt="code-logo"/>
      </div>
      
      <div className="nav-links">
        <a href="">Home</a>
        <a href="">Blog</a>
        <a href="">Questões</a>
      </div>

      <div className="searchBar">
        <img src={lupa} alt="lupa"/>
        <input type="text" placeholder="Pesquisar"/>
      </div>
     
      <div className="authButtons">
        <button className="login">Login</button>
        <button className="cadastro">Cadastro</button>
      </div>

      <div className="hamburger">
        <img src={burger} alt="burger menu"/>
      </div>
    </header>
  );
};
