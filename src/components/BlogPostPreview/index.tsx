import React from "react";
import { Avatar } from "../Avatar";
import comments from "../../assets/images/svg/icons/blueComment.svg";
import heart from "../../assets/images/svg/icons/blueHeart.svg";
import favorite from "../../assets/images/svg/icons/favoriteBlog.svg";
import { Post } from "../../types/postTypes";
import { formatDate } from "../../utils/formatDate";
import { PostImage } from "../PostImage";
import { logosArticleImg } from "../../assets/images/png";

interface IBlogPostPreview {
  article: Post;
  blogPostTitle: string;
  blogPostDescription: string;
  image?: boolean;
  imgSrc?: string;
  onClick?: () => void;
}

export const BlogPostPreview: React.FC<IBlogPostPreview> = ({
  article,
  blogPostTitle,
  blogPostDescription,
  image,
  imgSrc,
  onClick,
}) => {
  return (
    <div className="outer-post-wrapper" onClick={onClick}>
      <div className="post-wrapper">
        <div className="post-content">
          <Avatar
            name={article.author.display_name}
            sizes="medium"
            src={article.author.avatar_url}
          />
          <h1 className="blog-post-title">{blogPostTitle}</h1>
          <p className="blog-post-description">{blogPostDescription}</p>
          <div className="blog-post-footer">
            <div className="main-footer">
              <span>{formatDate(article.created_at)}</span>
              <p>
                <img src={heart} alt="like icon" /> {article.likeCount || 0}
              </p>
              <p>
                <img src={comments} alt="comments icon" />{" "}
                {article.commentCount || 0}
              </p>
            </div>
            <div className="sub-footer">
              <img src={favorite} alt="favorite icon" />
            </div>
          </div>
        </div>
        {image && ( // Conditionally render the image container
          <div className="post-image">
            <PostImage
              src={imgSrc}
              fallbackSrc={logosArticleImg}
              width={500}
              alt="Blog Post placeholder image"
            />
          </div>
        )}
      </div>
      <div className="blog-post-mobile-footer">
        <div className="main-footer">
          <span>{formatDate(article.created_at)}</span>
          <p>
            <img src={heart} alt="like icon" /> {article.likeCount}
          </p>
          <p>
            <img src={comments} alt="comments icon" /> {article.commentCount}
          </p>
        </div>
        <div className="sub-footer">
          <img src={favorite} alt="mobile favorite icon" />
        </div>
      </div>
    </div>
  );
};
