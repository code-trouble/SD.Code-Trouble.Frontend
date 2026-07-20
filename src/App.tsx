import { Toaster } from "sonner";
import { AppRoutes } from "./routes/routes";
import { useMe } from "./queries/user";

export default function App() {
  // Kick off the session request, but DON'T block the whole app on it.
  //
  // The old code returned a full-screen <LoadingScreen /> while /me was in
  // flight, which serialized every page load: /me (~1.2s) THEN the page's own
  // data (~2s). Pages now render immediately and fetch in parallel with /me,
  // so the user waits for the slower of the two, not the sum.
  // Tags are no longer gated on the session either — pages request them.
  useMe();

  return (
    <>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </>
  );
}
