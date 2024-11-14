import React from "react";

interface BadgeComponentProps {
    tags: string[];
}

export const BadgeComponent: React.FC<BadgeComponentProps> = ({
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
