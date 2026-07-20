import React, { useState, useRef, useEffect, useMemo } from "react";
import { TagList } from "../Tag";
import { useTags } from "../../queries/tags";

interface ITagSelector {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export const TagSelector: React.FC<ITagSelector> = ({
  selectedTags,
  onChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: tagsFromStore = [] } = useTags();

  const allTags = useMemo(
    () => tagsFromStore.map((tag) => tag.name),
    [tagsFromStore],
  );

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChange([tag, ...selectedTags]);
    }
    setDropdownOpen(false);
  };

  const handleRemoveTag = (tag: string) => {
    onChange(selectedTags.filter((t) => t !== tag));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="tag-selector-container"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      <div className="input-area tag-selector-input" onClick={toggleDropdown}>
        {selectedTags.length > 0 ? (
          <div className="tags-container">
            <TagList
              tags={selectedTags}
              onTagRemove={handleRemoveTag}
              icon={true}
            />
          </div>
        ) : (
          <span className="placeholder">
            Ex: javascript, array, front-end, etc
          </span>
        )}
      </div>
      {dropdownOpen && (
        <div
          className="tags-dropdown"
          ref={dropdownRef}
          style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}
        >
          {allTags.filter((tag) => !selectedTags.includes(tag)).length === 0 ? (
            <span>There are no tags left.</span>
          ) : (
            allTags
              .filter((tag) => !selectedTags.includes(tag))
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
  );
};
