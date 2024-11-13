import React from "react";
import profileAvatar from "../../assets/images/png/profileAvatar.png";
import vectorStar from "../../assets/images/png/starVector.png";
import upvote from "../../assets/images/png/upvote.png";
import comments from "../../assets/images/png/comments.png";
import arrowButton from "../../assets/images/png/arrowButton.png";

export const StackedCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">Escolhas da comunidade</h1>
      </div>
      <div className="card-content">
        <div className="card-author">
          <div className="author-info">
            <img src={profileAvatar} alt="profileAvatar" />
            <h2 className="author-name">Joana Lima</h2>
          </div>
          <div className="favorite-icon">
            <img src={vectorStar} alt="estrela de favorito" />
          </div>
        </div>

        <div className="card-body">
          <h1 className="card-heading">
            Porque Designers <span className="highlight-text">merecem mais respeito</span>
          </h1>
          <p className="card-description">
            An unconventional and compassionate guide to becoming an early bird.
          </p>
          <div className="tag-list">
            <button className="tag-item">Chat GPT</button>
            <button className="tag-item">Design</button>
            <button className="tag-item">Auto-Ajuda</button>
            <button className="tag-item">Pix</button>
          </div>

          <div className="card-details">
            <div className="details-left">
              <p className="post-date">10 Nov, 2024</p>
              <p className="upvote-count">
                <img src={upvote} alt="" />
                120k
              </p>
              <p className="comment-count">
                <img src={comments} alt="" />
                302
              </p>
            </div>
            <div className="details-right">
              <img src={arrowButton} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
