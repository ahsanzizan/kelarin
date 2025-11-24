import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "renderer/components/ui/alert";
import { Input } from "renderer/components/ui/input";
import { useAuth } from "renderer/data/auth/use-auth";
import { cn } from "renderer/lib/utils";
import { AuthFormValues, authSchema } from "shared/validations/auth";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

type AuthFormProps = {
  mode: "login" | "register";
  onSwitchMode: () => void;
};

export function AuthForm({ mode, onSwitchMode }: AuthFormProps) {
  const { mutate, isPending } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: { username: "", password: "" },
  });

  const { control } = form;

  async function onSubmit(values: AuthFormValues) {
    setErrorMessage(null);

    mutate(
      { ...values, mode },
      {
        onSuccess: () => {
          form.reset();
          navigate("/");
        },
        onError: (reqErr) =>
          setErrorMessage(
            reqErr instanceof Error ? reqErr.message : "Unexpected error"
          ),
      }
    );
  }

  const uiText = useMemo(
    () =>
      mode === "register"
        ? {
            title: "Kelarin",
            subtitle: "Create a local account",
            button: "Register & unlock",
            buttonLoading: "Securing account…",
            toggle: "Already have an account? Sign in.",
            autoComplete: "new-password",
          }
        : {
            title: "Kelarin",
            subtitle: "Login to your local account",
            button: "Sign in",
            buttonLoading: "Verifying…",
            toggle: "Need a new account? Register here.",
            autoComplete: "current-password",
          },
    [mode]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-200">Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="username"
                  placeholder="e.g. neonfox"
                  className="border-white/10 bg-black/50 text-white placeholder:text-gray-500"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-200">Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Minimum 8 characters"
                  autoComplete={uiText.autoComplete}
                  className="border-white/10 bg-black/50 text-white placeholder:text-gray-500"
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
          type="submit"
          disabled={isPending}
          className={cn("w-full", isPending && "cursor-wait opacity-80")}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uiText.buttonLoading}
            </>
          ) : (
            uiText.button
          )}
        </Button>
      </form>

      <div className="text-center mt-4">
        <Button
          variant="link"
          size="sm"
          type="button"
          onClick={onSwitchMode}
          disabled={isPending}
        >
          {mode === "register"
            ? "Already have an account? Sign in."
            : "Need a new account? Register here."}
        </Button>
      </div>
    </Form>
  );
}
