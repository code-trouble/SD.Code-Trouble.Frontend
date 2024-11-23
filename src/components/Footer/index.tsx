import React from "react";
import {
  discord,
  email,
  github,
  instagram,
  linkedIn,
  logoCodePrimaryFull,
  whatsApp,
} from "../../assets/images/svg/icons";

export const Footer: React.FC = () => {
  return (
    <footer>
      <img
        className="footer-logo"
        src={logoCodePrimaryFull}
        alt="logo da code trouble completo"
      />
      <main>
        <nav>
          <h1>Explore</h1>
          <a href="">Home</a>
          <a href="">Blog</a>
          <a href="">Questões</a>
        </nav>
        <section>
          <nav>
            <h1>Entre em Contato</h1>
            <a href="">
              <img src={whatsApp} alt="" />
              <p>(11) 9 4996-3686</p>
            </a>
            <a href="">
              <img src={email} alt="" />
              <p>suportededomingo@outlook.com</p>
            </a>
          </nav>
          <nav>
            <h1>Nossas Redes & Comunidades</h1>
            <div className="social-medias">
              <a href="">
                <img src={discord} alt="logo do discord" />
              </a>
              <a href="">
                <img src={github} alt="logo do github" />
              </a>
              <a href="">
                <img src={instagram} alt="logo do instagram" />
              </a>
              <a href="">
                <img src={linkedIn} alt="logo do linkedIn" />
              </a>
            </div>
          </nav>
          <div className="footer-contact">
            <div className="contact-text">
              <h1>Receba Atualizações</h1>
              <p>Se Inscreva na nossa NewsLetter.</p>
            </div>
            <form>
              <input type="email" name="" id="" />
              <button type="submit">Registrar-se</button>
            </form>
          </div>
        </section>
      </main>
      <div className="footer-bottom">
        <p>
          <span>© 2024.</span> All Rights Reserved.
        </p>
        <p>
          Designed By <span>Suporte de Domingo</span>
        </p>
      </div>
    </footer>
  );
};
