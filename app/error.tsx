"use client";

// Next.js file convention: error.tsx
// Global error boundary that catches runtime errors and renders
// a recovery UI instead of crashing the entire app.

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DocIntel Error]", error);
  }, [error]);

  return (
    <div className="flex h-svh flex-col items-center justify-center gap-6 bg-background p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-3xl">
        ⚠️
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-foreground">
          Something went wrong
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground/60">
            Error ID: {error.digest}
          </p>
        ) : null}
      </div>
      <Button onClick={reset} variant="outline" size="sm">
        Try again
      </Button>
    </div>
  );
}
