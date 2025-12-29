"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminProvider } from "@/contexts/AdminContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme" attribute="class">
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          <AdminProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </AdminProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}
