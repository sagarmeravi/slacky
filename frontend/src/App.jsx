import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import * as Sentry from "@sentry/react";
import CallPage from "./pages/CallPage.jsx";

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

const App = () => {
  const { isSignedIn } = useAuth();
  return (
    <SentryRoutes>
      <Route
        path="/"
        element={isSignedIn ? <HomePage /> : <Navigate to={"/auth"} replace />}
      />
      <Route
        path="/auth"
        element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
      />

      <Route
        path="/call/:id"
        element={isSignedIn ? <CallPage /> : <Navigate to={"/auth"} replace />}
      />

      <Route
        path="*"
        element={
          isSignedIn ? (
            <Navigate to={"/"} replace />
          ) : (
            <Navigate to={"/auth"} replace />
          )
        }
      />
    </SentryRoutes>
  );
};
export default App;
