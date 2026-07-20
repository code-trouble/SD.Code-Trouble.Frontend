import { useEffect, useMemo, useState } from "react";
import { AddToFavorite, ThreeDotsMenu } from "../../assets/images/svg";
import { blueComment, blueHeart } from "../../assets/images/svg/icons";
import { Avatar } from "../../components/Avatar";
import { TagList } from "../../components/Tag";
import { useNavigate, useParams } from "react-router-dom";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { OpenQuestionSkeleton } from "../../skeletons/OpenQuestionSkeleton";
import DOMPurify, { Config as PurifyConfig } from "dompurify";
import { highlightCodeBlocks } from "../../lib/highlight";
import "highlight.js/styles/github-dark.css";
import "quill/dist/quill.snow.css";
import { usePost, useToggleLike } from "../../queries/posts";
import {
  useCurrentUser,
  useFollowingIds,
  useProfile,
  useToggleFollow,
} from "../../queries/user";
import { usePostActions } from "../../hooks/usePostActions";
import MoreArticlesSection from "../../components/MoreArticlesSection";
import { ClipLoader } from "react-spinners";
import { canDeletePost, canEditPost } from "../../utils/permissions";
import { renderPostBody } from "../../utils/renderPostBody";

const purifyConfig: PurifyConfig = {
  USE_PROFILES: { html: true },
  ADD_TAGS: ["iframe"],
  ADD_ATTR: ["class", "src", "href", "alt", "target"],
};

const convertDelta = (delta: any): string => {
  if (!delta || !delta.ops) return "";
  const converter = new QuillDeltaToHtmlConverter(delta.ops, {
    inlineStyles: true,
  });
  return converter.convert();
};

export const OpenArticle: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: article, isLoading: isLoadingArticle, error } = usePost(id);
  const currentUser = useCurrentUser();
  const followingIds = useFollowingIds();
  const { mutate: toggleLike, isPending: isLiking } = useToggleLike();
  const { mutate: toggleFollow, isPending: isLoadingFollow } = useToggleFollow();

  const { data: postOwner } = useProfile(article?.author?.username);

  const { handleDelete, handleEdit } = usePostActions();

  useEffect(() => {
    if (!id) navigate("/blog");
  }, [id, navigate]);

  useEffect(() => {
    if (!isLoadingArticle && article) highlightCodeBlocks();
  }, [article, isLoadingArticle]);

  const authorId = article?.author?.id;
  const isFollowing = authorId ? followingIds.has(authorId) : false;

  const handleFollow = () => {
    if (!authorId) return;
    toggleFollow({ userId: authorId, isFollowing });
  };

  // Delta -> HTML -> sanitize is expensive; without this it re-ran on every
  // single render (including every like click).
  const cleanBody = useMemo(
    () =>
      article?.body?.content
        ? DOMPurify.sanitize(convertDelta(article.body.content), purifyConfig)
        : "",
    [article?.body?.content],
  );

  if (error || !article || isLoadingArticle) return <OpenQuestionSkeleton />;

  const tags = article.body?.tags || [];

  const handleToggleLike = () => {
    if (!article || isLiking) return;
    toggleLike(article.id);
  };

  return (
    <div className="open-article-wrapper">
      <div className="open-article-content">
        {/* Title + subtitle */}
        <div className="text-block">
          <h1>{article.title}</h1>
          <p>{article.body?.description || "Sem descrição"}</p>
        </div>

        {/* Author + follow */}
        <div className="socials-block">
          <Avatar
            name={article.author?.username}
            sizes="large"
            src={article.author?.avatar_url}
            onClick={() => navigate(`/${article.author?.username}`)}
          />
          {article.author.id !== currentUser?.id && (
            <button
              onClick={!isLoadingFollow ? handleFollow : undefined}
              disabled={isLoadingFollow}
            >
              {isLoadingFollow ? (
                <ClipLoader color="#2DBA4F" size={15} />
              ) : isFollowing ? (
                "Seguindo"
              ) : (
                "Seguir"
              )}
            </button>
          )}{" "}
        </div>

        {/* Likes / favorites / tags */}
        <div className="post-details">
          <div className="likes-and-actions">
            <div className="likes-comments">
              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                className="like-button"
                style={{
                  background: "none",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: isLiking ? "not-allowed" : "pointer",
                }}
              >
                <img
                  src={blueHeart}
                  alt="likes"
                  style={{
                    filter: article.isLikedByUser
                      ? "invert(39%) sepia(99%) saturate(500%) hue-rotate(320deg)"
                      : "none",
                    transform: article.isLikedByUser
                      ? "scale(1.1)"
                      : "scale(1)",
                    transition: "transform 0.2s ease, filter 0.2s ease",
                  }}
                />
                <span>{article.likeCount || 0}</span>
              </button>
              <p>
                <img src={blueComment} alt="comments" />
                {article.commentCount || 0}
              </p>
            </div>

            <div
              className="favorites-and-options"
              style={{ position: "relative" }}
            >
              <img src={AddToFavorite} alt="add to favorites" />
              {canDeletePost(article, currentUser) && (
                <div>
                  <img
                    onClick={() => setShowMenu((prev) => !prev)}
                    src={ThreeDotsMenu}
                    alt="menu with 3 dots"
                    style={{ cursor: "pointer" }}
                  />

                  {showMenu && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        zIndex: 1000,
                        minWidth: "120px",
                      }}
                    >
                      {canEditPost(article, currentUser) && (
                        <button
                          onClick={() => handleEdit(article)}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "8px 16px",
                            border: "none",
                            background: "none",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          Editar
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDelete(article.id, {
                            redirectPath: "/blog",
                          })
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "8px 16px",
                          border: "none",
                          background: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          color: "red",
                        }}
                      >
                        Deletar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="tagList-area">
            {tags.length > 0 ? (
              <TagList tags={tags} />
            ) : (
              <code>(sem tags)</code>
            )}
          </div>
        </div>

        <div className="delta-render-area">
          <div className="ql-container ql-snow">
            <div className="ql-editor">{renderPostBody(cleanBody)}</div>
          </div>
        </div>
      </div>

      <div className="open-article-extras">
        <div className="extras-wrapper">
          <div className="user-avatar">
            <img
              src={article.author.avatar_url}
              alt="foto de perfil do autor"
            />
          </div>
          <div className="user-information">
            <div className="escrito-por">
              <h1>
                Escrito por <strong>{article.author.display_name}</strong>{" "}
              </h1>
              {article.author.id !== currentUser?.id && (
                <button
                  onClick={!isLoadingFollow ? handleFollow : undefined}
                  disabled={isLoadingFollow}
                >
                  {isLoadingFollow ? (
                    <ClipLoader color="#2DBA4F" size={15} />
                  ) : isFollowing ? (
                    "Seguindo"
                  ) : (
                    "Seguir"
                  )}
                </button>
              )}{" "}
            </div>
            <span>{postOwner?._count?.followers} seguidores</span>

            <p>{postOwner?.bio}</p>
          </div>
          <div className="artigo-author-info">
            <div className="text-display">
              <h1>Mais artigos de {article.author.display_name}</h1>
              <p>
                E outros com:{" "}
                {(article.body.tags as string[]).map((tag) => (
                  <strong key={tag}>
                    {" "}
                    <span>{tag}</span>
                  </strong>
                ))}{" "}
              </p>
            </div>
          </div>
          <div className="mais-artigos">
            <MoreArticlesSection
              authorId={article.author_id}
              currentArticleId={article.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
