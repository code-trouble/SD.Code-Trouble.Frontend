import React, { useState } from "react";
import { pfpPageBanner, profileAvatar } from "../../assets/images/png";
import CustomButton from "../../components/CustomButton";
import { TagBadge } from "../../components/TagBadge";
import { ProfileSkeleton } from "../../skeletons/ProfileSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileTagBadge } from "../../components/ProfileTagBadge";
import { ClipLoader } from "react-spinners";
import { PostPreview } from "../../components/GenericPostPreview";
import { filterDropdownArrow } from "../../assets/images/svg";
import {
  useCurrentUser,
  useFollowingIds,
  useProfile,
  useToggleFollow,
} from "../../queries/user";
import { usePosts } from "../../queries/posts";
import {
  ConnectionsModal,
  ConnectionsType,
} from "../../components/ConnectionsModal";

type PostKindFilter = "article" | "question" | "answer" | "";

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  function navigateTo(path: string) {
    window.scrollTo(0, 0);
    navigate(path);
  }

  const currentUser = useCurrentUser();
  const isOwnProfile = currentUser?.username === username;

  // Own profile comes from the cached /me query — no extra request.
  const {
    data: profileUser,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useProfile(!isOwnProfile ? username : undefined);

  const displayUser = isOwnProfile ? currentUser : profileUser;

  const followingIds = useFollowingIds();
  const { mutate: toggleFollow, isPending: isLoadingFollow } = useToggleFollow();

  const [isTagsPopupOpen, setIsTagsPopupOpen] = useState(false);
  const [filtro, setFiltro] = useState<PostKindFilter>("");
  const [connectionsType, setConnectionsType] =
    useState<ConnectionsType | null>(null);

  const isFollowing =
    displayUser && !isOwnProfile ? followingIds.has(displayUser.id) : false;

  const handleFollow = () => {
    if (displayUser) toggleFollow({ userId: displayUser.id, isFollowing });
  };

  const { data: userPostsPage, isLoading: isLoadingPosts } = usePosts(
    {
      author_id: displayUser?.id,
      kind: filtro === "" ? undefined : filtro,
      limit: 20,
    },
    !!displayUser?.id,
  );
  const userPosts = userPostsPage?.data ?? [];

  const error = profileError ? "Usuário não encontrado" : null;

  const getPostDescription = (body: any): string => {
    if (body?.content?.ops) {
      return (
        body.content.ops
          .map((op: any) => (typeof op.insert === "string" ? op.insert : ""))
          .join("")
          .trim()
          .slice(0, 100) + (body.content.ops.join("").length > 100 ? "..." : "")
      );
    }
    return "Sem descrição disponível";
  };

  const displayedPosts = userPosts.filter((post) => post.kind !== "answer");

  if (!username) {
    return <div>URL inválida</div>;
  }

  if (isOwnProfile && !currentUser) {
    return <ProfileSkeleton />;
  }

  if (!isOwnProfile && isLoadingProfile) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="profile-page-wrapper">
        <div className="error-message">
          <h2>{error}</h2>
          <CustomButton
            backgroundColor="#15181B"
            color="#fff"
            padding="8px 24px"
            text="Voltar"
            onClick={() => navigate(-1)}
          />
        </div>
      </div>
    );
  }

  if (!displayUser) {
    return <ProfileSkeleton />;
  }

  const userInterestTags =
    displayUser.user_interests?.map((interest) => interest.tag) || [];

  const maxVisibleTags = 5;
  const visibleUserTags = userInterestTags.slice(0, maxVisibleTags);
  const hiddenUserTags = userInterestTags.slice(maxVisibleTags);
  const remainingUserCount = hiddenUserTags.length;

  return (
    <>
      <div className="profile-page-wrapper">
        <img
          src={
            displayUser.banner_url
              ? (displayUser.banner_url as string)
              : pfpPageBanner
          }
          alt="banner do usuário"
        />
        <div className="profile-details">
          <div className="userInfo">
            <div className="avatarDisplay">
              <img
                src={
                  displayUser.avatar_url
                    ? (displayUser.avatar_url as string)
                    : profileAvatar
                }
                alt="foto de perfil"
              />
            </div>
            <h1>{displayUser.display_name}</h1>
            <p>{displayUser.pronouns || "Ele/Dele"}</p>
            <span>{displayUser.bio || "sem bio"}</span>

            <div className="followersInfo">
              <div className="posts count">
                <p>{displayUser._count?.posts}</p>
                <p>publicações</p>
              </div>
              <button
                type="button"
                className="followers count clickable"
                onClick={() => setConnectionsType("followers")}
              >
                <p>{displayUser._count?.followers}</p>
                <p>seguidores</p>
              </button>
              <button
                type="button"
                className="following count clickable"
                onClick={() => setConnectionsType("following")}
              >
                <p>{displayUser._count?.following}</p>
                <p>seguindo</p>
              </button>
            </div>
          </div>

          <div className="userActions">
            {isOwnProfile ? (
              <CustomButton
                backgroundColor="#15181B"
                color="#fff"
                padding="8px 78px"
                text="Editar Perfil"
                onClick={() => navigate("/onboarding")}
              />
            ) : (
              <CustomButton
                backgroundColor="#15181B"
                color="#fff"
                padding="8px 78px"
                text={isFollowing ? "Seguindo" : "Seguir"}
                disabled={isLoadingFollow}
                onClick={() => {
                  handleFollow();
                }}
              >
                {isLoadingFollow ? (
                  <ClipLoader color="#ffffff" size={15} />
                ) : undefined}
              </CustomButton>
            )}

            <h2>Interesses</h2>

            {userInterestTags.length > 0 ? (
              <div className="tag-list" style={{ position: "relative" }}>
                {visibleUserTags.map((tag) => (
                  <ProfileTagBadge key={tag.id} tag={tag} />
                ))}

                {remainingUserCount > 0 && (
                  <button
                    className="tag-item more-tags-button"
                    onClick={() => setIsTagsPopupOpen(!isTagsPopupOpen)}
                    type="button"
                  >
                    +{remainingUserCount}
                  </button>
                )}

                {isTagsPopupOpen && (
                  <div className="tags-popup">
                    {hiddenUserTags.map((tag) => (
                      <TagBadge key={tag.id} tag={tag} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="info-text">
                {isOwnProfile
                  ? "Nenhum interesse selecionado ainda."
                  : `${displayUser.username} ainda não selecionou interesses.`}
              </p>
            )}
          </div>
        </div>
        <div className="user-posts-display">
          <div className="posts-display-header">
            <p>
              {isOwnProfile
                ? "Seus posts"
                : `Posts de: ${displayUser.display_name}`}
            </p>
            <div
              className="filter-select-wrapper"
              style={
                {
                  "--arrow-icon": `url(${filterDropdownArrow})`,
                } as React.CSSProperties
              }
            >
              <select
                className="filter-select"
                aria-label="Filtrar posts por tipo"
                onChange={(e) => setFiltro(e.target.value as PostKindFilter)}
                value={filtro}
              >
                <option value="">Ordenar por Todos</option>
                <option value="article">Ordenar por Artigos</option>
                <option value="question">Ordenar por Perguntas</option>
              </select>
            </div>
          </div>
          <div className="posts-display">
            {isLoadingPosts ? (
              <ClipLoader color="#15181B" size={50} />
            ) : userPosts.length > 0 ? (
              displayedPosts.map((post) =>
                post.kind === "question" ? (
                  <PostPreview
                    key={post.id}
                    post={post}
                    postTitle={post.title}
                    postDescription={getPostDescription(post.body)}
                    kind={post.kind}
                    onClick={() => navigateTo(`/questions/${post.id}`)}
                  />
                ) : (
                  <PostPreview
                    key={post.id}
                    post={post}
                    postTitle={post.title}
                    postDescription={getPostDescription(post.body)}
                    kind={post.kind}
                    onClick={() => navigateTo(`/blog/${post.id}`)}
                  />
                ),
              )
            ) : (
              <p>Nenhum post encontrado para este filtro.</p>
            )}
          </div>
        </div>
      </div>

      {connectionsType && (
        <ConnectionsModal
          username={displayUser.username}
          type={connectionsType}
          onClose={() => setConnectionsType(null)}
        />
      )}
    </>
  );
};
