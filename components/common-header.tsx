"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { fadeIn } from "@/lib/transitions"
import { Zap } from "lucide-react"

interface CommonHeaderProps {
  showThemeToggle?: boolean
  isConnected?: boolean
  connectAction?: () => void
}

export function CommonHeader({
  showThemeToggle = true,
  isConnected,
  connectAction,
}: CommonHeaderProps) {
  return (
    <motion.header
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex h-13 shrink-0 items-center justify-between border-b border-border bg-background px-5"
    >
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <Zap className="size-7 text-primary drop-shadow-xs drop-shadow-amber-100" />
          <span className="text-base font-bold tracking-tight">DocIntel</span>
        </div>

        <Badge
          variant="secondary"
          className="text-[0.65rem] tracking-wider uppercase"
        >
          Vectorless RAG
        </Badge>
      </div>

      <div className="flex items-center gap-2.5">
        {connectAction && (
          <Button variant="outline" size="sm" onClick={connectAction}>
            Enter API Key
          </Button>
        )}
        {showThemeToggle && <ThemeToggle />}
        {isConnected && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>
            <span>Connected</span>
          </div>
        )}
      </div>
    </motion.header>
  )
}
