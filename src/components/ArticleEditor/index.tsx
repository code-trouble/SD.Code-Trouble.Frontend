import React, { useRef, useEffect, useState } from "react";
import AEditor from "./editor";
import Quill from "quill";
import { TagList } from "../Tag";
import { useTags } from "../../queries/tags";
import { useImageUpload } from "../../hooks/useImageUpload";
import { ClipLoader } from "react-spinners";

interface IArticleEditor {
  value: any;
  onChange: (delta: any) => void;
  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const ArticleEditor: React.FC<IArticleEditor> = ({
  value,
  onChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  tags,
  onTagsChange,
}) => {
  const toolbarId = useRef(
    "article-toolbar-" + Math.random().toString(36).substring(2, 9),
  );

  const quillRef = useRef<Quill | null>(null);
  const { data: tagsFromStore = [] } = useTags();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { uploadFile } = useImageUpload();
  const [uploading, setUploading] = useState(false);

  const handleTextChange = (_delta: any, _oldDelta: any, source: string) => {
    if (source === "user" && quillRef.current) {
      const currentContents = quillRef.current.getContents();
      onChange(currentContents);
    }
  };

  const handlePaste = async (e: Event, quill: Quill) => {
    const clipboardEvent = e as ClipboardEvent;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const items = clipboardEvent.clipboardData?.items;
    if (!items) return;

    let hasHandledImage = false;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (!file) continue;

        quill.focus();
        let range = quill.getSelection();

        if (!range) {
          const length = quill.getLength();
          range = { index: length, length: 0 };
          quill.setSelection(range.index, range.length, "silent");
        }

        if (!range) continue;

        setUploading(true);
        try {
          const url = await uploadFile(file, "tmp-post-images");
          quill.insertEmbed(range.index, "image", url, "user");
          quill.setSelection(range.index + 1, 0, "user");
          hasHandledImage = true;
        } catch (error) {
          console.error("Image upload failed:", error);
        } finally {
          setUploading(false);
        }
        break;
      }
    }

    if (!hasHandledImage && clipboardEvent.clipboardData) {
      const text = clipboardEvent.clipboardData.getData("text/plain");
      const html = clipboardEvent.clipboardData.getData("text/html");

      const currentSelection = quill.getSelection();
      if (!currentSelection) return;

      if (html) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const plainText = tempDiv.textContent || tempDiv.innerText || "";
        quill.insertText(currentSelection.index, plainText, "user");
      } else if (text) {
        quill.insertText(currentSelection.index, text, "user");
      }
    }
  };

  const setupImageHandler = () => {
    const toolbar = document.getElementById(toolbarId.current);
    if (!toolbar) return;

    const imageButton = toolbar.querySelector(".ql-image");
    if (!imageButton) return;

    const handleImageClick = () => {
      if (!quillRef.current) return;

      const quill = quillRef.current;
      quill.focus();

      let range = quill.getSelection();
      if (!range) {
        const length = quill.getLength();
        range = { index: length, length: 0 };
        quill.setSelection(range.index, range.length, "silent");
      }

      const currentRange = range;

      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file || !currentRange) return;

        setUploading(true);
        try {
          const url = await uploadFile(file, "tmp-post-images");
          quill.insertEmbed(currentRange.index, "image", url, "user");
          quill.setSelection(currentRange.index + 1, 0, "user");
        } catch (error) {
          console.error("Image upload failed:", error);
        } finally {
          setUploading(false);
        }
      };

      input.click();
    };

    imageButton.replaceWith(imageButton.cloneNode(true));
    const newImageButton = toolbar.querySelector(".ql-image");
    newImageButton?.addEventListener("click", handleImageClick);

    return () => {
      newImageButton?.removeEventListener("click", handleImageClick);
    };
  };

  useEffect(() => {
    if (!quillRef.current) return;

    const hasValidContent =
      value?.ops && Array.isArray(value.ops) && value.ops.length > 0;

    if (hasValidContent) {
      const editorContent = quillRef.current.getContents();

      if (JSON.stringify(editorContent) !== JSON.stringify(value)) {
        quillRef.current.setContents(value, "silent");
      }
    }
  }, [value]);

  useEffect(() => {
    const cleanup = setupImageHandler();
    return cleanup;
  }, []);

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setDropdownOpen(false);
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag));
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const allTags = tagsFromStore.map((tag) => tag.name);

  return (
    <div className="articleEditor-container">
      <div id={toolbarId.current} className="custom-toolbar">
        <span className="ql-formats">
          <button className="ql-bold">Bold</button>
          <button className="ql-italic">Italic</button>
          <button className="ql-underline">Underline</button>
          <button className="ql-strike">Strike</button>
        </span>
        <span className="separator"></span>
        <span className="ql-formats">
          <button className="ql-code-block">Code</button>
          <button className="ql-list" value="bullet">
            List
          </button>
          <button className="ql-list" value="ordered">
            Ordered
          </button>
        </span>
        <span className="separator"></span>
        <span className="ql-formats last-ql-format">
          <button className="ql-image">Image</button>
          <button className="ql-video">Video</button>
          <button className="ql-link">Link</button>
        </span>
      </div>

      <div className="editor-form">
        <div className="editor-container" style={{ position: "relative" }}>
          <input
            placeholder="Título"
            className="editor-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
          />

          <input
            placeholder="Descrição (subtítulo)"
            className="editor-description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
          />

          <div className="editor-tags">
            <div className="tags-button-wrapper">
              {tags.length > 0 && (
                <TagList tags={tags} onTagRemove={handleRemoveTag} />
              )}
              <div className="tags-button-container">
                <button
                  className="tags-button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown();
                  }}
                >
                  {tags.length === 0 ? "Adicione tags +" : "+"}
                </button>
                {dropdownOpen && (
                  <div className="tags-dropdown">
                    {allTags.filter((tag) => !tags.includes(tag)).length ===
                    0 ? (
                      <span>Nenhuma tag disponível</span>
                    ) : (
                      allTags
                        .filter((tag) => !tags.includes(tag))
                        .map((tag, index) => (
                          <button
                            key={index}
                            className="dropdown-tag-item"
                            onClick={() => handleAddTag(tag)}
                          >
                            {tag}
                          </button>
                        ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <AEditor
              ref={quillRef}
              readOnly={false}
              defaultValue={value}
              onTextChange={handleTextChange}
              onSelectionChange={() => {}}
              toolbarId={toolbarId.current}
              onPaste={handlePaste}
            />

            {uploading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.6)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <ClipLoader size={50} color="#36d7b7" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
