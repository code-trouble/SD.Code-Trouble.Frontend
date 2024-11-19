import React from "react";
import vectorStar from "../../../assets/images/png/starVector.png";
import upvote from "../../../assets/images/png/upvote.png";
import comments from "../../../assets/images/png/comments.png";
import arrowButton from "../../../assets/images/png/arrowButton.png";
import { Tag } from "../Tag/index";
import { Avatar } from "../Avatar";

interface IStackedCard {
  username: string;
  headingTitle: string;
  subTitle: string;
  tagArray: string[];
  onArrowClick: () => void;
  imageSrc?: string;
  isDisabled: boolean;
}

export const StackedCard: React.FC<IStackedCard> = ({
  username,
  headingTitle,
  subTitle,
  onArrowClick,
  tagArray,
  imageSrc,
  isDisabled,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">Escolhas da comunidade</h1>
      </div>
      <div className="card-content">
        <div className="card-author">
          <div className="author-info">
            <Avatar sizes="medium" name={username} src={imageSrc} />
          </div>
          <div className="favorite-icon">
            <img src={vectorStar} alt="estrela de favorito" />
          </div>
        </div>

        <div className="card-body">
          <h1 className="card-heading">{headingTitle}</h1>
          <p className="card-description">{subTitle}</p>

          <Tag tags={tagArray} />

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
            <div
              className={`details-right ${!isDisabled ? "active-arrow" : ""}`}
            >
              <button
                onClick={onArrowClick}
                className="arrow-button"
                disabled={isDisabled}
              >
                <img className="arrow-button-img" src={arrowButton} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
