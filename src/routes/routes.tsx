import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { FaqLayout } from "../layouts/FaqLayout";
import { BlogLayout } from "../layouts/BlogLayout";
import { ProtectedRoute } from "./guards/authGuard";
import { LoadingScreen } from "../components/LoadingScreen";

// Lazy-load every page so a route only downloads the JS it actually needs.
// Heavy deps (quill ~600KB, highlight.js ~1.6MB, framer-motion) used only by
// the editor/post pages no longer bloat the landing/blog/questions bundles.
const LandingPage = lazy(() =>
  import("../pages/Landing").then((m) => ({ default: m.LandingPage })),
);
const TestingPage = lazy(() =>
  import("../pages/TestingPage").then((m) => ({ default: m.TestingPage })),
);
const Questions = lazy(() =>
  import("../pages/Questions").then((m) => ({ default: m.Questions })),
);
const OpenQuestion = lazy(() =>
  import("../pages/OpenQuestion").then((m) => ({ default: m.OpenQuestion })),
);
const AskAQuestion = lazy(() =>
  import("../pages/AskAQuestion").then((m) => ({ default: m.AskAQuestion })),
);
const Blog = lazy(() =>
  import("../pages/Blog").then((m) => ({ default: m.Blog })),
);
const WriteAPost = lazy(() =>
  import("../pages/WriteAPost").then((m) => ({ default: m.WriteAPost })),
);
const ErrorPage = lazy(() =>
  import("../pages/404").then((m) => ({ default: m.ErrorPage })),
);
const ComingSoonPage = lazy(() =>
  import("../pages/ComingSoon").then((m) => ({ default: m.ComingSoonPage })),
);
const Onboarding = lazy(() =>
  import("../pages/Onboarding").then((m) => ({ default: m.Onboarding })),
);
const ProfilePage = lazy(() =>
  import("../pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const PassResetHandler = lazy(() =>
  import("../pages/PassResetHandler").then((m) => ({
    default: m.PassResetHandler,
  })),
);
const OpenArticle = lazy(() =>
  import("../pages/OpenArticle").then((m) => ({ default: m.OpenArticle })),
);
const ExploreCommunity = lazy(() =>
  import("../pages/ExploreCommunity").then((m) => ({
    default: m.ExploreCommunity,
  })),
);

const protect = (element: React.ReactNode) => (
  <ProtectedRoute>{element}</ProtectedRoute>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<FaqLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/test" element={<TestingPage />} />
          <Route path="/reset-password" element={<PassResetHandler />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<OpenQuestion />} />
          <Route path="/ask-a-question" element={protect(<AskAQuestion />)} />
          <Route path="/onboarding" element={protect(<Onboarding />)} />
          <Route path="/community" element={<ExploreCommunity />} />
          <Route path="/:username" element={protect(<ProfilePage />)} />
        </Route>

        <Route element={<BlogLayout />}>
          <Route path="/write-a-post" element={protect(<WriteAPost />)} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<OpenArticle />} />
        </Route>

        <Route path="coming-soon" element={<ComingSoonPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};
