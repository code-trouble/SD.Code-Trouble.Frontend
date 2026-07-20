import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "../../stores/postStore";
import CustomButton from "../../components/CustomButton";
import { ArticleEditor } from "../../components/ArticleEditor";
import { BlueFavorite } from "../../assets/images/svg";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useCreatePost, useUpdatePost } from "../../queries/posts";

export const WriteAPost: React.FC = () => {
  const navigate = useNavigate();
  // Draft state stays in zustand (client state); saving is a server mutation.
  const { reset, isEditMode, editingPostId, title: storeTitle, body: storeBody } =
    usePostStore();

  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();
  const isLoading = isCreating || isUpdating;
  const [error, setError] = useState<string | null>(null);

  const { moveTmpImagesInDeltas } = useImageUpload();

  // ✅ apenas content começa como {}
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<Record<string, any>>({ ops: [] });
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode && storeBody) {
      setTitle(storeTitle || "");
      setDescription(storeBody.description || "");
      setContent(storeBody.content || {});
      setTags(storeBody.tags || []);
    }
  }, [isEditMode, storeTitle, storeBody]);

  useEffect(() => {
    return () => {
      if (!isEditMode) reset();
    };
  }, [reset, isEditMode]);

  function navigateTo(path: string) {
    window.scrollTo(0, 0);
    navigate(path);
  }

  // ✅ agora é handler de form
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      const [movedContent] = await moveTmpImagesInDeltas({ deltas: [content] });

      const combinedBody = {
        content: movedContent,
        description,
        tags,
      };

      const result =
        isEditMode && editingPostId
          ? await updatePost({
              id: editingPostId,
              data: { title, body: combinedBody, kind: "article" },
            })
          : await createPost({
              kind: "article",
              title,
              body: combinedBody,
            });

      setTitle("");
      setDescription("");
      setContent({});
      setTags([]);
      reset();

      navigateTo(`/blog/${result.id}`);
    } catch (err) {
      console.error("Failed to save article:", err);
      setError("Não foi possível salvar o artigo. Tente novamente.");
    }
  }

  function handleDiscard() {
    setTitle("");
    setDescription("");
    setContent({});
    setTags([]);
    reset();
    navigateTo("/blog");
  }

  return (
    <div className="writeAPost-container">
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      <div className="writeAPost-inner-container">
        {/* ✅ formulário controla o submit */}
        <form onSubmit={handleSubmit}>
          <div
            className="post-submit"
            style={{ marginTop: "20px", display: "flex", gap: "16px" }}
          >
            <img src={BlueFavorite} alt="" />
            <CustomButton
              text={
                isLoading ? "Salvando..." : isEditMode ? "Atualizar" : "Postar"
              }
              type="submit" // ✅ botão de submit
              padding="10px 100px"
              backgroundColor="#3348A4"
              color="#FAFCFE"
              fontSize="18px"
              fontWeight="500"
              borderRadius="8px"
              disabled={isLoading}
            />
            <CustomButton
              text="Descartar"
              onClick={handleDiscard}
              color="#BA2D2F"
              backgroundColor="transparent"
              border="1px solid #BA2D2F"
              padding="12px 32px"
              fontSize="18px"
              fontWeight="500"
              borderRadius="8px"
            />
          </div>

          {/* ✅ campos do editor dentro do form */}
          <ArticleEditor
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
            value={content}
            onChange={setContent}
            tags={tags}
            onTagsChange={setTags}
          />
        </form>
      </div>
    </div>
  );
};
