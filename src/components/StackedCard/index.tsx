import React from "react";
import profileAvatar from "../../assets/images/png/profileAvatar.png"
import vectorStar from "../../assets/images/png/starVector.png"
import upvote from "../../assets/images/png/upvote.png"
import comments from "../../assets/images/png/comments.png"
import arrowButton from "../../assets/images/png/arrowButton.png"

export const StackedCard: React.FC = () => {

  return (
    <div className="card-wrapper">
        <div className="upper-div">
          <h1 className="upper-div-h1">Escolhas da comunidade</h1>
        </div>
        <div className="lower-div">
          <div className="lower-div-top">
            <div className="lower-div-top-left">
              <img src={profileAvatar} alt="profileAvatar"/>
              <h2 className="lower-div-top-h2">Joana Lima</h2>
            </div>
            <div className="lower-div-top-right">
              <img src={vectorStar} alt="estrela de favorito"/>
            </div>
          </div>
          
          <div className="lower-div-bottom">
            <h1 className="lower-div-bottom-h1">
              Porque Designers <span className="lower-div-bottom-h1-span">merecem mais respeito</span>
            </h1>
            <p className="lower-div-bottom-p">An unconventional and compassionate guide to becoming an early bird.</p>
            <div className="lower-div-bottom-tags">
              <button className="lower-div-bottom-tags-tag">
                Chat GPT
              </button>
              <button className="lower-div-bottom-tags-tag">
                Design
              </button>
              <button className="lower-div-bottom-tags-tag">
                Auto-Ajuda
              </button>
              <button className="lower-div-bottom-tags-tag">
                Pix
              </button>
            </div>

            <div className="lower-div-bottom-details">
              <div className="lower-div-bottom-details-left">
                <p className="lower-div-bottom-details-left-date">
                  10 Nov, 2024
                </p>
                <p className="lower-div-bottom-details-left-upvote">
                  <img src={upvote} alt=""/>
                  120k
                </p>
                <p className="lower-div-bottom-details-left-comments">
                  <img src={comments} alt=""/>
                  302
                </p>
              </div>
              <div className="lower-div-bottom-details-right">
                <img src={arrowButton} alt=""/>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};
