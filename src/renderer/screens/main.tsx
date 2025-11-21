import { Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "renderer/components/ui/alert";
import { Button } from "renderer/components/ui/button";
import { SessionLoading } from "renderer/components/widgets/session-loading";
import { useLocalSession } from "../hooks/use-local-session";
import { AuthFormScreen } from "./auth-form";

const { App } = window;

export function MainScreen() {
  const navigate = useNavigate();
  const { session, isLoading, isProcessing, error, logout, applySession } =
    useLocalSession();

  if (isLoading) {
    return <SessionLoading />;
  }

  if (session?.isAuthenticated && session.user) {
    return (
      <main className="flex h-screen flex-col items-center justify-center">
        <Alert className="mt-5 w-fit border-transparent bg-transparent text-accent">
          <AlertTitle className="text-5xl text-teal-400">
            Hi, {session.user.username}!
          </AlertTitle>

          <AlertDescription className="flex w-full flex-col gap-6 text-lg text-gray-200">
            <div className="flex items-center gap-2">
              <Terminal className="size-6 text-fuchsia-300" />
              <span>Your private workspace is unlocked on this device.</span>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-3">
                <Button onClick={() => App.switchToStickyMode()}>
                  Switch to sticky mode
                </Button>
                <Button onClick={() => App.switchToGeneralMode()}>
                  Switch to general mode
                </Button>
              </div>

              <Button
                disabled={isProcessing}
                onClick={logout}
                variant="outline"
              >
                Sign out
              </Button>
            </div>

            <Button
              className="self-start"
              onClick={() => navigate("/privacy")}
              variant="secondary"
            >
              How does offline privacy work?
            </Button>

            <p className="text-sm text-gray-400">
              Registered on {new Date(session.user.createdAt).toLocaleString()}
            </p>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return <AuthFormScreen onSessionChange={applySession} />;
}
