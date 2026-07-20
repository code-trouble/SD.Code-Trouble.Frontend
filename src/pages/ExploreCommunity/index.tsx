import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { profileAvatar } from "../../assets/images/png";
import CustomButton from "../../components/CustomButton";
import {
  useCurrentUser,
  useExploreUsers,
  useFollowingIds,
  useToggleFollow,
} from "../../queries/user";

const BATCH_SIZE = 12;

export const ExploreCommunity: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const followingIds = useFollowingIds();
  const { mutate: toggleFollow } = useToggleFollow();
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useExploreUsers(BATCH_SIZE);

  const suggestions = data?.pages.flat() ?? [];

  function navigateTo(path: string) {
    window.scrollTo(0, 0);
    navigate(path);
  }

  return (
    <div className="explore-community-wrapper">
      <header className="explore-header">
        <h1>Explore a Comunidade</h1>
        <p>
          Descubra pessoas da comunidade, conheça seus perfis e siga quem
          publica conteúdos do seu interesse.
        </p>
      </header>

      {isLoading ? (
        <div className="explore-feedback">
          <ClipLoader color="#3348A4" size={50} />
        </div>
      ) : isError ? (
        <div className="explore-feedback">
          <p>Não foi possível carregar os usuários. Tente novamente.</p>
          <CustomButton
            backgroundColor="#3348A4"
            color="#fff"
            padding="8px 24px"
            text="Tentar novamente"
            onClick={() => refetch()}
          />
        </div>
      ) : suggestions.length === 0 ? (
        <div className="explore-feedback">
          <p>Nenhum usuário novo para conhecer no momento. Volte mais tarde!</p>
        </div>
      ) : (
        <>
          <div className="explore-grid">
            {suggestions.map((user) => {
              const isSelf = currentUser?.id === user.id;
              const isFollowing = followingIds.has(user.id);
              const isPendingRow = pendingUserId === user.id;

              return (
                <article className="user-card" key={user.id}>
                  <button
                    type="button"
                    className="user-card-info"
                    onClick={() => navigateTo(`/${user.username}`)}
                  >
                    <img
                      src={user.avatar_url || profileAvatar}
                      alt={`Foto de ${user.display_name || user.username}`}
                      loading="lazy"
                    />
                    <h2>{user.display_name || user.username}</h2>
                    <span className="user-card-username">
                      @{user.username}
                    </span>
                    <p className="user-card-bio">
                      {user.bio || "Este usuário ainda não escreveu uma bio."}
                    </p>
                  </button>

                  <div className="user-card-actions">
                    {!isSelf && (
                      <CustomButton
                        padding="6px 20px"
                        text={
                          isPendingRow ? "" : isFollowing ? "Seguindo" : "Seguir"
                        }
                        border="2px solid #3348A4"
                        color={isFollowing ? "#fff" : "#3348A4"}
                        backgroundColor={isFollowing ? "#3348A4" : "transparent"}
                        borderRadius="75px"
                        disabled={pendingUserId !== null}
                        onClick={() => {
                          setPendingUserId(user.id);
                          toggleFollow(
                            { userId: user.id, isFollowing },
                            { onSettled: () => setPendingUserId(null) },
                          );
                        }}
                      >
                        {isPendingRow ? (
                          <ClipLoader
                            color={isFollowing ? "#ffffff" : "#3348A4"}
                            size={14}
                          />
                        ) : undefined}
                      </CustomButton>
                    )}
                    <CustomButton
                      padding="6px 20px"
                      text="Ver perfil"
                      backgroundColor="#15181B"
                      color="#fff"
                      borderRadius="75px"
                      onClick={() => navigateTo(`/${user.username}`)}
                    />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="explore-refresh">
            {hasNextPage ? (
              <CustomButton
                backgroundColor="#3348A4"
                color="#fff"
                padding="10px 32px"
                text={
                  isFetchingNextPage ? "Buscando..." : "Mostrar outras pessoas"
                }
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              />
            ) : (
              <p className="explore-end-message">
                Você já conheceu todo mundo da comunidade por aqui! 🎉
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
