import MoreArticlesPreview from "../MoreArticlesPreview";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../queries/posts";

interface MoreArticlesSectionProps {
  currentArticleId: number;
  authorId: number;
}

const MoreArticlesSection: React.FC<MoreArticlesSectionProps> = ({
  currentArticleId,
  authorId,
}) => {
  const navigate = useNavigate();
  function navigateTo(path: string) {
    window.scrollTo(0, 0);
    navigate(path);
  }

  // Only need a couple of the author's other articles — ask the server for 3
  // (so we still have 2 after excluding the one being read).
  const { data, isLoading } = usePosts(
    { kind: "article", author_id: authorId, limit: 3 },
    !!authorId,
  );

  const filteredArticles = (data?.data ?? [])
    .filter((article) => article.id !== currentArticleId)
    .slice(0, 2);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (filteredArticles.length === 0) {
    return null;
  }

  return (
    <div className="more-articles-section">
      <div className="articles-list">
        {filteredArticles.map((article) => (
          <MoreArticlesPreview
            key={article.id}
            title={article.title}
            imgSrc={article.body?.coverImage} // Adjust based on your data structure
            author={article.author?.display_name || article.author?.username}
            authorPfp={article.author?.avatar_url}
            articleLikes={article.likeCount?.toString() || "0"}
            articleComments={article.commentCount?.toString() || "0"}
            date={formatDate(article.created_at)}
            tags={article.body?.tags?.join(", ") || ""} // Join tags if array
            onClick={() => navigateTo(`/blog/${article.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default MoreArticlesSection;
