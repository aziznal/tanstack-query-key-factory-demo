"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export const queryClientConfig = {
  staleTimeMs: 5 * 1000,
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: queryClientConfig.staleTimeMs,
      refetchOnWindowFocus: true,
      networkMode: "always",
      // refetchInterval: queryClientConfig.staleTimeMs,
    },
  },
});

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
