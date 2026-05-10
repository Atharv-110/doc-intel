"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { UploadZone } from "@/components/upload-zone"
import { DocumentList } from "@/components/document-list"
import { slideInLeft } from "@/lib/transitions"
import type { Document } from "@/lib/types"

interface DocumentsPanelProps {
  documents: Document[]
  selectedDocId: string | null
  onSelect: (doc: Document) => void
  onDelete: (docId: string) => void
  onRefresh: () => void
  onUploadComplete: () => void
}

export function DocumentsPanel({
  documents,
  selectedDocId,
  onSelect,
  onDelete,
  onRefresh,
  onUploadComplete,
}: DocumentsPanelProps) {
  return (
    <motion.aside
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
      className="flex w-68 shrink-0 flex-col overflow-hidden border-r border-border bg-muted/30"
      id="documents-panel"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Documents
        </h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={onRefresh}
            >
              <RefreshCw />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh documents</TooltipContent>
        </Tooltip>
      </div>

      {/* Upload Zone */}
      <UploadZone onUploadComplete={onUploadComplete} />

      <Separator className="mx-3 mt-3 w-auto" />

      {/* Document List */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <DocumentList
          documents={documents}
          selectedDocId={selectedDocId}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      </div>

      {/* Footer */}
      <div className="mt-auto shrink-0 border-t border-border px-4 py-3 text-center text-[0.65rem] text-muted-foreground">
        © 2026 Atharv Vani.{" "}
        <Link
          href="https://github.com/atharv-110"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          GitHub
        </Link>
      </div>
    </motion.aside>
  )
}
