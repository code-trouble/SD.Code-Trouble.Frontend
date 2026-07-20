import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FocusLock from "react-focus-lock";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Avatar } from "../Avatar";
import CustomButton from "../CustomButton";
import {
  useConnections,
  useCurrentUser,
  useFollowingIds,
  useToggleFollow,
} from "../../queries/user";

export type ConnectionsType = "followers" | "following";

interface IConnectionsModal {
  username: string;
  type: ConnectionsType;
  onClose: () => void;
}

export const ConnectionsModal: React.FC<IConnectionsModal> = ({
  username,
  type,
  onClose,
}) => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const followingIds = useFollowingIds();
  const { mutate: toggleFollow } = useToggleFollow();
  // Only the clicked row shows a spinner/disables, not every button at once.
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useConnections(username, type);

  const users = data?.pages.flat() ?? [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    // Trava o scroll da página enquanto o modal está aberto
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function goToProfile(profileUsername: string) {
    onClose();
    window.scrollTo(0, 0);
    navigate(`/${profileUsername}`);
  }

  function goToCommunity() {
    onClose();
    window.scrollTo(0, 0);
    navigate("/community");
  }

  const title = type === "followers" ? "Seguidores" : "Seguindo";
  const emptyMessage =
    type === "followers"
      ? "Ainda não há seguidores por aqui."
      : "Este perfil ainda não segue ninguém.";

  // Portal no body: nenhum ancestral com transform/overflow pode "prender"
  // o overlay — ele sempre cobre a viewport inteira e centraliza o modal.
  return createPortal(
    <div className="connections-overlay" onClick={onClose}>
      <FocusLock className="connections-focus-lock">
        <dialog
          className="connections-modal"
          aria-label={title}
          onClick={(e) => e.stopPropagation()}
        >
          <header className="connections-header">
            <h2>{title}</h2>
            <button
              className="close-button"
              aria-label="Fechar"
              onClick={onClose}
            >
              ✕
            </button>
          </header>

          <main className="connections-list">
            {isLoading ? (
              <div className="connections-feedback">
                <ClipLoader color="#3348A4" size={35} />
              </div>
            ) : isError ? (
              <p className="connections-feedback">
                Não foi possível carregar a lista. Tente novamente.
              </p>
            ) : users.length === 0 ? (
              <p className="connections-feedback">{emptyMessage}</p>
            ) : (
              users.map((user) => {
                const isSelf = currentUser?.id === user.id;
                const isFollowing = followingIds.has(user.id);
                const isPendingRow = pendingUserId === user.id;

                return (
                  <div className="connection-row" key={user.id}>
                    <Avatar
                      sizes="medium"
                      name={user.display_name || user.username}
                      role={`@${user.username}`}
                      src={user.avatar_url ?? undefined}
                      onClick={() => goToProfile(user.username)}
                    />
                    {!isSelf && (
                      <CustomButton
                        padding="4.5px 14px"
                        text={isPendingRow ? "" : isFollowing ? "Seguindo" : "Seguir"}
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
                  </div>
                );
              })
            )}

            {hasNextPage && (
              <button
                className="load-more-button"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
              </button>
            )}
          </main>

          <footer className="connections-footer">
            <p>Quer conhecer mais gente?</p>
            <button className="explore-link" onClick={goToCommunity}>
              Explore a comunidade
            </button>
          </footer>
        </dialog>
      </FocusLock>
    </div>,
    document.body,
  );
};
