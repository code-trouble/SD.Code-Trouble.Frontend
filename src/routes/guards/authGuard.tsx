import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModalStore } from "../../stores/authModalStore";
import { useMe } from "../../queries/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: currentUser, isPending } = useMe();
  const { openModal } = useAuthModalStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !currentUser) {
      openModal("signIn");
      navigate("/", { replace: true });
    }
  }, [currentUser, isPending, openModal, navigate]);

  // Only protected routes wait for the session — public pages render right away.
  if (isPending) return null;

  return currentUser ? <>{children}</> : null;
};
