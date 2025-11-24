import { useState } from "react";
import { AuthForm } from "renderer/components/forms/auth/auth-form";

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <main className="flex h-screen items-center justify-center bg-background px-6">
      <section className="max-w-md w-full rounded-2xl backdrop-blur bg-white/5 p-8 border border-white/10 shadow-2xl">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-white">Kelarin</h1>
          <p className="text-gray-300 mt-2">
            {mode === "register"
              ? "Create a local account"
              : "Login to your local account"}
          </p>
        </header>

        <AuthForm
          mode={mode}
          onSwitchMode={() => setMode(mode === "login" ? "register" : "login")}
        />
      </section>
    </main>
  );
}
