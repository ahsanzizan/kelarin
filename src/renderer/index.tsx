import React from "react";
import ReactDom from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppRoutes } from "./routes";

import { Toaster } from "./components/ui/sonner";
import { TitleBar } from "./components/widgets/title-bar";
import "./globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 1000 * 30, // 30s
    },
  },
});

ReactDom.createRoot(document.querySelector("app") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full overflow-hidden">
        <TitleBar />
        <div className="pt-8">
          <AppRoutes />
        </div>
      </div>
      <Toaster position="top-center" />
    </QueryClientProvider>
  </React.StrictMode>
);
