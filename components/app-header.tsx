"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { fadeIn } from "@/lib/transitions";

export function AppHeader() {
  return (
    <motion.header
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex h-13 shrink-0 items-center justify-between border-b border-border bg-background px-5"
    >
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="size-7 text-primary"
          >
            <rect
              x="2"
              y="2"
              width="28"
              height="28"
              rx="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M10 10h4v4h-4zM18 10h4v4h-4zM10 18h4v4h-4zM18 18h4v4h-4z"
              fill="currentColor"
              opacity="0.45"
            />
            <path
              d="M12 12v8M20 12v8M12 16h8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-base font-bold tracking-tight">DocIntel</span>
        </div>

        <Badge variant="secondary" className="text-[0.65rem] uppercase tracking-wider">
          Vectorless RAG
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
          <span>Connected</span>
        </div>
      </div>
    </motion.header>
  );
}
