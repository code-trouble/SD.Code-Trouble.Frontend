import React from "react";

interface ITag {
    tags: string[];
}

export const Tag: React.FC<ITag> = ({
    tags
}) => {
  return (
    <div className="tag-list">
    {tags.map((tag, index) => (
      <button key={index} className="tag-item">
        {tag}
      </button>
    ))}
  </div>
  );
};
