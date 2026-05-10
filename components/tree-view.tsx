"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  staggerContainer,
  staggerItem,
  treeChildrenVariant,
} from "@/lib/transitions"
import type { TreeNode as TreeNodeType, TreeStats } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, TreePine } from "lucide-react"
import { memo, useCallback, useState } from "react"

// Depth-based color classes using semantic tokens + subtle accent hues
const DEPTH_COLORS = [
  "bg-primary",
  "bg-emerald-400",
  "bg-violet-400",
  "bg-amber-400",
  "bg-teal-400",
] as const

// --- TreeNode component ---

const TreeNodeItem = memo(function TreeNodeItem({
  node,
  depth,
  isRoot,
}: {
  node: TreeNodeType
  depth: number
  isRoot: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showText, setShowText] = useState(false)
  const hasChildren = Boolean(node.nodes && node.nodes.length > 0)
  const depthColor = DEPTH_COLORS[Math.min(depth, DEPTH_COLORS.length - 1)]

  const handleToggle = useCallback(() => {
    if (hasChildren) {
      setIsExpanded((prev) => !prev)
    }
    if (node.text) {
      setShowText((prev) => !prev)
    }
  }, [hasChildren, node.text])

  return (
    <div className={cn("relative", !isRoot && "ml-5")}>
      {/* Connector line for child nodes */}
      {!isRoot ? (
        <div className="absolute top-3.5 -left-4 h-px w-3 bg-border" />
      ) : null}

      {/* Node row */}
      <motion.div
        className={cn(
          "group flex cursor-pointer items-center gap-1 rounded-none px-2 py-1.5 transition-colors select-none hover:bg-muted/80"
        )}
        onClick={handleToggle}
        whileTap={{ scale: 0.99 }}
      >
        {/* Chevron */}
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center text-muted-foreground",
            !hasChildren && "invisible"
          )}
        >
          <ChevronRight className="size-3.5" />
        </motion.div>

        {/* Depth dot */}
        <div className={cn("size-2 shrink-0 rounded-sm", depthColor)} />

        {/* Label */}
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm",
            isRoot ? "font-bold" : "font-medium"
          )}
        >
          {node.title ?? "Untitled"}
        </span>

        {/* Child count */}
        {hasChildren ? (
          <span className="shrink-0 text-[0.6rem] text-muted-foreground">
            {node.nodes!.length}
          </span>
        ) : null}

        {/* Page badge */}
        {node.page_index != null ? (
          <Badge
            variant="outline"
            className="h-5 shrink-0 px-1.5 font-mono text-[0.6rem]"
          >
            p.{node.page_index}
          </Badge>
        ) : null}
      </motion.div>

      {/* Text preview */}
      <AnimatePresence>
        {showText && node.text ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="py-1 pr-2 pl-8 text-xs leading-relaxed text-muted-foreground">
              {node.text.length > 300
                ? node.text.substring(0, 300) + "…"
                : node.text}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren ? (
          <motion.div
            variants={treeChildrenVariant}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="relative ml-4 border-l border-border pl-1"
          >
            {node.nodes!.map((child, idx) => (
              <TreeNodeItem
                key={`${child.title ?? idx}-${idx}`}
                node={child}
                depth={depth + 1}
                isRoot={false}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
})

// --- Main TreeView ---

interface TreeViewProps {
  treeData: TreeNodeType[] | null
  isLoading: boolean
  error: string | null
  isProcessing: boolean
  stats: TreeStats | null
  docName: string | null
}

export function TreeView({
  treeData,
  isLoading,
  error,
  isProcessing,
  stats,
  docName,
}: TreeViewProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="size-7 animate-spin rounded-full border-2 border-border border-t-primary" />
        <p className="text-sm text-muted-foreground">Building document tree…</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
        <TreePine className="size-12 text-muted-foreground/30" />
        <h3 className="text-base font-semibold">Failed to Load Tree</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  // Processing state
  if (isProcessing) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
        <div className="size-7 animate-spin rounded-full border-2 border-border border-t-primary" />
        <h3 className="text-base font-semibold">Document Processing…</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          The document is still being processed. The tree will appear when
          ready.
        </p>
      </div>
    )
  }

  // Empty state
  if (!treeData) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          className="text-primary opacity-40"
        >
          <circle cx="32" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="40" r="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="48" cy="40" r="5" stroke="currentColor" strokeWidth="2" />
          <circle
            cx="8"
            cy="58"
            r="4"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <circle
            cx="24"
            cy="58"
            r="4"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <circle
            cx="40"
            cy="58"
            r="4"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <circle
            cx="56"
            cy="58"
            r="4"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <path
            d="M32 18v8M22 36l6-10M42 36l-6-10M12 52l2-8M20 52l-2-8M44 52l2-8M52 52l-2-8"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.35"
          />
        </svg>
        <h3 className="text-base font-semibold">Document Tree Visualization</h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Select a processed document to explore its hierarchical structure.
          <br />
          This is the{" "}
          <strong className="text-foreground">vectorless index</strong> that
          PageIndex builds — no embeddings required.
        </p>
      </div>
    )
  }

  // Tree view
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="p-5">
        {/* Document header card */}
        <Card className="mb-5">
          <CardHeader className="flex-row items-center gap-3 py-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-none bg-primary text-lg text-primary-foreground">
              📄
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-sm">
                {docName ?? "Document"}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                PageIndex Vectorless Tree Structure
              </p>
            </div>
            {stats ? (
              <div className="flex gap-5">
                <div className="text-center">
                  <div className="text-lg font-bold">{stats.totalNodes}</div>
                  <div className="text-[0.6rem] tracking-wider text-muted-foreground uppercase">
                    Nodes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{stats.maxDepth}</div>
                  <div className="text-[0.6rem] tracking-wider text-muted-foreground uppercase">
                    Depth
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{stats.rootSections}</div>
                  <div className="text-[0.6rem] tracking-wider text-muted-foreground uppercase">
                    Sections
                  </div>
                </div>
              </div>
            ) : null}
          </CardHeader>
        </Card>

        {/* Tree nodes */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-0.5"
        >
          {treeData.map((node, idx) => (
            <motion.div key={`root-${idx}`} variants={staggerItem}>
              <TreeNodeItem node={node} depth={0} isRoot={true} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
