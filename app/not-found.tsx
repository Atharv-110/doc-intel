import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-6 bg-background p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-4xl">
        🔍
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-foreground">Page Not Found</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        Go Home
      </Link>
    </div>
  )
}
