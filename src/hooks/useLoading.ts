import { useController } from "@/contexts/controllerContext";
import { useCallback } from "react";

export default function useLoading() {
  const { isLoading, setIsLoading } = useController();

  const startLoading = useCallback(() => setIsLoading(true), []);

  const stopLoading = useCallback(() => setIsLoading(false), []);

  return {
    startLoading,
    stopLoading,
    isLoading,
  };
}
