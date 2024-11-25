import React from "react";
import { Header } from "../../components/Header";
import messageBox from "../../assets/images/svg/messageBox.svg"
import CustomButton from "../../components/CustomButton";
import buttonArrow from "../../assets/images/svg/buttonArrow.svg"
import { StackedCards } from "../../components/StackedCards";
import { Footer } from "../../components/Footer";


export const LandingPage: React.FC = () => {
  return (
    <div className="main-wrapper">
        <Header theme="base" loggedIn={true}/>
        <div className="landingContainer">
          <div className="upperHero">
            <div className="">
              <div className="heroTextContent">
                <h1 className="heroTextH1">Todo <span className="green-middle-line">Dev precisa</span> de ajuda de vez em quando.</h1>
                <p className="heroTextPItalic">Na sua máquina não funciona?</p>
                <p className="heroTextP">Aqui é o lugar certo pra trocar ideia, fazer perguntas, buscar soluções e
                  desbravar código com a galera
                </p>
              </div>
              <div className="customButtonWrapper">
                <CustomButton  
                  text="Cadastro"
                  backgroundColor="#2DBA4F"  
                  padding="8px 90px"
                  color="white"
                  fontSize="18px"
                  fontWeight="500"
                  
                />

                <CustomButton 
                  text="Visitar a comunidade"
                  backgroundColor="transparent"  
                  padding="9.5px 0px"
                  color="#3348A4"
                  fontSize="16px"
                  fontWeight="400"
                  icon={buttonArrow}
                />
              </div>
            </div>
            <div className="messageBox">
              <img src={messageBox} alt=""/>
            </div>
          </div>

          <div className="lowerHero">
            <div className="StackCardBlock">
              <StackedCards/>
            </div>

            <div className="lowerHeroRigthText">
              <div className="lowerHeroTextContent">
                <h1 className="lowerHeroH1">Conheça nosso blog, feito por <span className="dev-blue-line">Devs</span> para <span className="dev-blue-line">Devs</span></h1>
                <p className="lowerHeroPItalic">Leia artigos da sua área de interesse.</p>
                <p className="lowerHeroP">Os melhores artigos vão além das respostas, guiando você em cada descoberta</p>
              </div>
              <div className="lowerCustomButton">
                <CustomButton
                  text="Visitar Blog"
                  backgroundColor="#3348A4"  
                  padding="8px 80px"
                  color="white"
                  fontSize="18px"
                  fontWeight="500"
                  
                />
              </div>
            </div>

          </div>
        </div>
        <Footer/>
    </div>
  );
};
