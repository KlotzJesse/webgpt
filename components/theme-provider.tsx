"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "./ui/toaster";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </NextThemesProvider>
  );
}
