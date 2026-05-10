"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="shrink-0 rounded-full"
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      aria-label="Toggle theme"
    >
      <SunIcon className="size-5 text-foreground/80 dark:text-foreground/90" />
      <MoonIcon className="absolute size-5 text-foreground/80 dark:text-foreground/90 dark:opacity-0" />
    </Button>
  )
}
