"use client";

// Next.js file convention: loading.tsx
// Shows a shimmer/skeleton while the page is loading.

export default function Loading() {
  return (
    <div className="flex h-svh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 animate-spin rounded-full border-4 border-border border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading DocIntel…</p>
      </div>
    </div>
  );
}
