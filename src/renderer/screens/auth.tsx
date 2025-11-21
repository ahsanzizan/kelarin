import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "renderer/components/ui/alert";
import { Button } from "renderer/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "renderer/components/ui/form";
import { Input } from "renderer/components/ui/input";
import { useLocalSession } from "renderer/hooks/use-local-session";
import { cn } from "renderer/lib/utils";
import { SessionSnapshot } from "shared/types";
import { z } from "zod";

const { App } = window;

const authSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(48, "Username must not exceed 48 characters")
    .regex(
      /^[A-Za-z0-9._-]+$/,
      "Username can only contain letters, numbers, dots, underscores, and hyphens"
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

export function AuthScreen() {
  const [mode, setMode] = useState<"register" | "login">("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { applySession } = useLocalSession();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: AuthFormValues) {
    setErrorMessage(null);

    try {
      const snapshot =
        mode === "register"
          ? await App.register(values)
          : await App.login(values);

      if (snapshot.error !== undefined) {
        setErrorMessage(snapshot.error);
        return;
      }

      applySession(snapshot.data!);
      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't finish that request. Please try again."
      );
    }
  }

  function toggleMode() {
    setMode((prev) => (prev === "register" ? "login" : "register"));
    setErrorMessage(null);
    form.reset();
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <main className="flex h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="mt-2 text-3xl font-semibold text-white">Kelarin</h1>
          <p className="mt-2 text-base text-gray-300">
            {mode === "register"
              ? "Create a local account"
              : "Login to your local account"}
          </p>
        </div>

        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. neonfox"
                      autoComplete="username"
                      className="border-white/10 bg-black/50 text-white placeholder:text-gray-500 focus:border-fuchsia-400/50 focus:ring-fuchsia-500/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Minimum 8 characters"
                      autoComplete={
                        mode === "register"
                          ? "new-password"
                          : "current-password"
                      }
                      className="border-white/10 bg-black/50 text-white placeholder:text-gray-500 focus:border-fuchsia-400/50 focus:ring-fuchsia-500/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {errorMessage && (
              <Alert
                variant="destructive"
                className="border-red-400/50 bg-red-500/10"
              >
                <AlertDescription className="text-red-400">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              className={cn("w-full", isSubmitting && "cursor-wait opacity-80")}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "register" ? "Securing account…" : "Verifying…"}
                </>
              ) : mode === "register" ? (
                "Register & unlock"
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </Form>

        <div className="w-full mt-4 flex justify-center">
          <Button
            variant={"link"}
            size={"sm"}
            onClick={toggleMode}
            type="button"
          >
            {mode === "register"
              ? "Already have an account on this device? Sign in."
              : "Need a new account? Register here."}
          </Button>
        </div>
      </section>
    </main>
  );
}
