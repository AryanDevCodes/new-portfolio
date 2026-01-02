"use client";

import { createContext, useContext } from "react";

type LoadingContextValue = {
  startLoading: () => void;
  stopLoading: () => void;
  isLoading: boolean;
};

const noop = () => {};
const defaultValue: LoadingContextValue = { startLoading: noop, stopLoading: noop, isLoading: false };
const LoadingContext = createContext<LoadingContextValue>(defaultValue);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  return <LoadingContext.Provider value={defaultValue}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  return useContext(LoadingContext);
}
