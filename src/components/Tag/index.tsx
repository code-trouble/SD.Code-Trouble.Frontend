import React from "react";

interface ITag {
    tags: string[];
    onTagRemove?: (tag: string) => void;
}

export const Tag: React.FC<ITag> = ({ tags, onTagRemove }) => {
    return (
        <div className="tag-list">
            {tags.map((tag, index) => (
                <button
                    key={index}
                    className="tag-item"
                    onClick={() => onTagRemove && onTagRemove(tag)}
                >
                    {tag} {onTagRemove && ''}
                </button>
            ))}
        </div>
    );
};
