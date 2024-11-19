import React, { useState } from "react";
import { StackedCard } from "../StackedCard";
import profileAvatar from "../../../assets/images/png/profileAvatar.png";
import profileAvatar2 from "../../../assets/images/png/profileAvatar2.png";

const CardTags = ["Chat GPT", "Design", "Auto-Ajuda", "Pix"];
const CardTags2 = ["123", "Código", "Web", "Pix"];

export const StackedCards: React.FC = () => {
  const [cardOrder, setCardOrder] = useState(["card-1", "card-2", "card-3"]);

  const handleSwap = () => {
    setCardOrder((prevOrder) => [prevOrder[1], prevOrder[2], prevOrder[0]]);
  };

  return (
    <div className="cards-wrapper">
      <div className={`individual-card ${cardOrder[0]}`}>
        <StackedCard
          username="Joana Lima"
          headingTitle="Porque Designers mercem mais respeito"
          subTitle="An unconventional and compassionate guide to becoming an early bird."
          tagArray={CardTags}
          onArrowClick={handleSwap}
          imageSrc={profileAvatar}
          isDisabled={cardOrder[0] !== "card-1"}
        />
      </div>
      <div className={`individual-card ${cardOrder[1]}`}>
        <StackedCard
          username="João Silveira"
          headingTitle="Porque devs sao bla bla bla etc"
          subTitle="asjdhajkshdasjkdasj subtitulo da silva aiaiaidsjakdasdsd"
          tagArray={CardTags}
          onArrowClick={handleSwap}
          imageSrc={profileAvatar2}
          isDisabled={cardOrder[1] !== "card-1"}
        />
      </div>
      <div className={`individual-card ${cardOrder[2]}`}>
        <StackedCard
          username="Adasdczxcd"
          headingTitle="Responsive web design is dead"
          subTitle="Being a web designer is not an easy task nowadays"
          tagArray={CardTags2}
          onArrowClick={handleSwap}
          imageSrc={profileAvatar}
          isDisabled={cardOrder[2] !== "card-1"}
        />
      </div>
    </div>
  );
};
