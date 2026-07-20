import React from "react";
import { Avatar } from "../Avatar";
import { formatDate } from "../../utils/formatDate";
import { AnswerActions } from "../AnswerActions";
import { Post } from "../../types/postTypes";
import { useQuillToHtml } from "../../hooks/useDeltaToHtml";
import { renderPostBody } from "../../utils/renderPostBody";

interface AnswerCardProps {
  answer: Post;
  currentUserId?: number | null;
  isModerator?: boolean;
  onEdit?: (answer: Post) => void;
  onDelete?: (id: number) => void | Promise<void>;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  answer,
  currentUserId,
  isModerator = false,
  onEdit,
  onDelete,
}) => {
  const { convertBody } = useQuillToHtml();

  const isOwner = answer.author.id === currentUserId;
  const canDelete = isOwner || isModerator;

  return (
    <div className="answerDisplayBlock">
      <div className="answerUserArea">
        <Avatar
          sizes="large"
          src={answer.author.avatar_url}
          name={answer.author.display_name}
        />
        <p>
          <span className="mutedCriado">
            Criado
            <br /> {formatDate(answer.created_at)}
          </span>
        </p>
      </div>

      <div className="answerText">{renderPostBody(convertBody(answer.body))}</div>

      {canDelete && (
        <AnswerActions
          canEdit={isOwner}
          onEdit={() => onEdit?.(answer)}
          onDelete={() => onDelete?.(answer.id)}
        />
      )}
    </div>
  );
};
