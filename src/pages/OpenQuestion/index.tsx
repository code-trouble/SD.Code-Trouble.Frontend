import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify, { Config as PurifyConfig } from "dompurify";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import "quill/dist/quill.snow.css";
import { TagList } from "../../components/Tag";
import { formatDate } from "../../utils/formatDate";
import comments from "../../assets/images/svg/greenComments.svg";
import addToFavorite from "../../assets/images/svg/addToFavorite.svg";
import threeDotMenu from "../../assets/images/svg/3dotsMenu.svg";
import { Avatar } from "../../components/Avatar";
import CustomButton from "../../components/CustomButton";
import { OpenQuestionSkeleton } from "../../skeletons/OpenQuestionSkeleton";
import { ClipLoader } from "react-spinners";

import "highlight.js/styles/github-dark.css";
import { highlightCodeBlocks } from "../../lib/highlight";
import {
  useCreatePost,
  useDeletePost,
  usePost,
  useToggleLike,
  useUpdatePost,
} from "../../queries/posts";
import {
  useCurrentUser,
  useFollowingIds,
  useToggleFollow,
} from "../../queries/user";
import { usePostActions } from "../../hooks/usePostActions";
import { upvote } from "../../assets/images/png";
import { TextEditor } from "../../components/Editor";
import { AnswerCard } from "../../components/AnswerCard";
import { Post } from "../../types/postTypes";
import {
  canDeletePost,
  canEditPost,
  isModerator,
} from "../../utils/permissions";
import { useImageUpload } from "../../hooks/useImageUpload";
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

export const OpenQuestion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: question,
    isLoading: isLoadingPosts,
    error,
    refetch: refetchQuestion,
  } = usePost(id);

  const currentUser = useCurrentUser();
  const followingIds = useFollowingIds();
  const { mutate: toggleLike, isPending: isLiking } = useToggleLike();
  const { mutate: toggleFollow, isPending: isLoadingFollow } = useToggleFollow();
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: updatePost } = useUpdatePost();
  const { mutateAsync: deletePost } = useDeletePost();

  const { handleDelete, handleEdit } = usePostActions();
  const { moveTmpImagesInDeltas } = useImageUpload();

  // Estados separados para nova resposta e edição
  const [newAnswer, setNewAnswer] = useState<{ ops: any[] }>({ ops: [] });
  const [editingAnswer, setEditingAnswer] = useState<Post | null>(null);
  const [editedAnswerBody, setEditedAnswerBody] = useState<{ ops: any[] }>({
    ops: [],
  });

  const [showMenu, setShowMenu] = useState(false);
  const [isPostingAnswer, setIsPostingAnswer] = useState(false);
  const [isUpdatingAnswer, setIsUpdatingAnswer] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) navigate("/questions");
  }, [id, navigate]);

  useEffect(() => {
    if (!isLoadingPosts && question) highlightCodeBlocks();
  }, [question, isLoadingPosts]);

  const handlePostNewAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question?.id) return;
    if (!newAnswer?.ops?.length) {
      alert("Digite algo antes de postar!");
      return;
    }

    try {
      setIsPostingAnswer(true);

      const [answerToSend] = await moveTmpImagesInDeltas({
        deltas: [newAnswer],
      });
      await createPost({
        kind: "answer",
        body: answerToSend,
        parent_id: question.id,
      });

      setNewAnswer({ ops: [] });

      editorRef.current?.scrollIntoView({ behavior: "smooth" });
      await refetchQuestion();
    } catch (err) {
      console.error("Erro ao postar resposta:", err);
    } finally {
      setIsPostingAnswer(false);
    }
  };

  const handleUpdateAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnswer || !editedAnswerBody?.ops?.length) return;

    try {
      setIsUpdatingAnswer(true);

      const [bodyToSend] = await moveTmpImagesInDeltas({
        deltas: [editedAnswerBody],
      });
      await updatePost({
        id: editingAnswer.id,
        data: { body: bodyToSend, kind: "answer" },
      });

      // Reseta o estado só depois de concluir
      setEditingAnswer(null);
      setEditedAnswerBody({ ops: [] });

      await refetchQuestion();
    } catch (err) {
      console.error("Erro ao atualizar resposta:", err);
    } finally {
      setIsUpdatingAnswer(false);
    }
  };

  // Delta -> HTML -> sanitize used to re-run on every render (every like click
  // re-sanitized the whole question). Memoized on the body only.
  const cleanDesc = useMemo(
    () =>
      DOMPurify.sanitize(convertDelta(question?.body?.description), purifyConfig),
    [question?.body?.description],
  );
  const cleanDetailsMemo = useMemo(
    () => DOMPurify.sanitize(convertDelta(question?.body?.details), purifyConfig),
    [question?.body?.details],
  );

  if (error || !question || isLoadingPosts) return <OpenQuestionSkeleton />;

  const handleLikeClick = (postId: number) => {
    if (isLiking) return;
    toggleLike(postId);
  };

  const cleanDetails = cleanDetailsMemo;
  const tags = question.body?.tags || [];

  const questionAuthor = question.author?.id;
  const isFollowing = questionAuthor ? followingIds.has(questionAuthor) : false;
  const handleFollow = () => {
    if (questionAuthor) toggleFollow({ userId: questionAuthor, isFollowing });
  };

  const answers = question?.answers || [];

  const handleEditAnswerClick = (ans: Post) => {
    setEditingAnswer(ans);
    setEditedAnswerBody(ans.body);
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleCancelEdit = () => {
    setEditingAnswer(null);
  };

  return (
    <div className="open-question-container">
      <div className="open-question-inner-container">
        {/* Question title */}
        <div className="title-wrapper">
          <h1>{question.title}</h1>
          <p>
            <span className="mutedCriado">Criado</span>{" "}
            {formatDate(question.created_at)}
          </p>
        </div>

        {/* Tags */}
        <div className="tagList-area">
          {tags.length > 0 ? <TagList tags={tags} /> : <code>(sem tags)</code>}
        </div>

        {/* Description */}
        <div className="question-description ql-container ql-snow">
          <div className="ql-editor">{renderPostBody(cleanDesc)}</div>
        </div>

        {/* Details */}
        {cleanDetails && (
          <section>
            <div className="open-question-details ql-container ql-snow">
              <div className="ql-editor">{renderPostBody(cleanDetails)}</div>
            </div>
          </section>
        )}

        {/* Likes & comments */}
        <div className="bottomGroupDiv">
          <div className="commentsNlikes">
            <button
              disabled={isLiking}
              onClick={() => handleLikeClick(question.id)}
              className="like-button"
            >
              <img
                src={upvote}
                alt="upvotes"
                className={question.isLikedByUser ? "liked" : ""}
              />
              <p>{question.likeCount}</p>
            </button>
            <p>
              <img src={comments} alt="comments" />
              {answers.length || 0}
            </p>
          </div>

          <div className="favoritesNoptions">
            <img src={addToFavorite} alt="add to favorites" />
            {canDeletePost(question, currentUser) && (
              <div style={{ position: "relative" }}>
                <img
                  src={threeDotMenu}
                  alt="menu with 3 dots"
                  onClick={() => setShowMenu(!showMenu)}
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
                    {canEditPost(question, currentUser) && (
                      <button
                        onClick={() => handleEdit(question)}
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
                        handleDelete(question.id, {
                          redirectPath: "/questions",
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

        {/* Question author */}
        <div className="questionCreator">
          <p>Criador(a) da pergunta</p>
          <div className="followUser">
            <Avatar
              sizes="large"
              name={question.author.username}
              role=""
              src={question.author.avatar_url}
              onClick={() => navigate(`/${question.author.username}`)}
            />
            <div className="followButton">
              {question.author.id === currentUser?.id ? null : (
                <>
                  <span className="dot" />
                  <p
                    onClick={!isLoadingFollow ? handleFollow : undefined}
                    style={{ cursor: isLoadingFollow ? "default" : "pointer" }}
                  >
                    {isLoadingFollow ? (
                      <ClipLoader color="#2DBA4F" size={15} />
                    ) : isFollowing ? (
                      "Seguindo"
                    ) : (
                      "Seguir"
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="answersArea">
          <div className="upperAnswers">
            <p>
              {answers.length} Resposta{answers.length !== 1 && "s"}
            </p>
            <div className="filterAnswers">
              <p>Ordenar por:</p>
              <div className="filterAnswersDropdown">
                <select className="order-select" aria-label="Ordenar respostas">
                  <option value="newest">Mais recentes</option>
                  <option value="oldest">Mais antigas</option>
                  <option value="top">Mais curtidas</option>
                </select>
              </div>
            </div>
          </div>

          {answers.length === 0 ? (
            <div className="answerDisplayBlock">
              <div className="answerUserArea">
                <Avatar sizes="large" name="Sem respostas" />
                <p>
                  <span className="mutedCriado">Nenhuma resposta ainda</span>
                </p>
              </div>
              <div className="answerText">
                <p>Seja o primeiro a responder esta pergunta!</p>
              </div>
            </div>
          ) : (
            [...answers]
              .sort((a, b) => (a.isAccepted ? -1 : b.isAccepted ? 1 : 0))
              .map((ans) => (
                <AnswerCard
                  key={ans.id}
                  answer={ans}
                  currentUserId={currentUser?.id ?? null}
                  isModerator={isModerator(currentUser)}
                  onEdit={() => handleEditAnswerClick(ans)}
                  onDelete={async (id) => {
                    if (
                      window.confirm(
                        "Tem certeza que deseja deletar esta resposta?",
                      )
                    ) {
                      await deletePost(id);
                      await refetchQuestion();
                    }
                  }}
                />
              ))
          )}

          {/* Formulários separados - Renderização condicional */}
          <div ref={editorRef}>
            {editingAnswer ? (
              // FORMULÁRIO DE EDIÇÃO
              <form className="answerForm" onSubmit={handleUpdateAnswer}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h1>Editar Resposta</h1>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      padding: "8px 16px",
                      background: "#f5f5f5",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
                <div className="editor-wrapper">
                  <TextEditor
                    onChange={setEditedAnswerBody}
                    value={editedAnswerBody}
                  />
                </div>
                <CustomButton
                  type="submit"
                  text={
                    isUpdatingAnswer ? "Atualizando..." : "Atualizar Resposta"
                  }
                  padding="10px 24px"
                  color="white"
                  backgroundColor="#2DBA4F"
                  fontSize="18px"
                  fontWeight="500"
                  disabled={isUpdatingAnswer}
                  children={isUpdatingAnswer ? <ClipLoader /> : ""}
                />
              </form>
            ) : (
              // FORMULÁRIO DE NOVA RESPOSTA
              <form className="answerForm" onSubmit={handlePostNewAnswer}>
                <h1>Responder</h1>
                <div className="editor-wrapper">
                  <TextEditor
                    onChange={(val) => {
                      setNewAnswer(val);
                    }}
                    value={newAnswer}
                  />
                </div>
                <CustomButton
                  type="submit"
                  text={isPostingAnswer ? "Postando..." : "Poste sua resposta"}
                  padding="10px 24px"
                  color="white"
                  backgroundColor="#2DBA4F"
                  fontSize="18px"
                  fontWeight="500"
                  disabled={isPostingAnswer}
                  children={isPostingAnswer ? <ClipLoader /> : ""}
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
