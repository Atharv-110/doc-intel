"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { staggerContainer, staggerItem } from "@/lib/transitions"
import type { Document } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { FileText, FileWarning, X } from "lucide-react"
import { memo, useCallback } from "react"

interface DocumentListProps {
  documents: Document[]
  selectedDocId: string | null
  onSelect: (doc: Document) => void
  onDelete: (docId: string) => void
}

const STATUS_CONFIG = {
  completed: {
    label: "Ready",
    variant: "default" as const,
    className:
      "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20",
  },
  processing: {
    label: "Processing",
    variant: "secondary" as const,
    className:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20 animate-pulse",
  },
  queued: { label: "Queued", variant: "outline" as const, className: "" },
  failed: { label: "Failed", variant: "destructive" as const, className: "" },
} as const

const DocumentItem = memo(function DocumentItem({
  doc,
  isSelected,
  onSelect,
  onDelete,
}: {
  doc: Document
  isSelected: boolean
  onSelect: (doc: Document) => void
  onDelete: (docId: string) => void
}) {
  const status = STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.queued
  const handleSelect = useCallback(() => onSelect(doc), [doc, onSelect])

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        "group relative flex cursor-pointer items-start gap-3 px-3 py-2.5 transition-colors",
        isSelected
          ? "bg-primary/10 ring-1 ring-primary/20"
          : "hover:bg-muted/50",
        doc.status !== "completed" && "opacity-70"
      )}
      onClick={handleSelect}
      id={`doc-item-${doc.id}`}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center",
          isSelected
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {doc.status === "failed" ? (
          <FileWarning className="size-4" />
        ) : (
          <FileText className="size-4" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{doc.name ?? doc.id}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <Badge
            variant={status.variant}
            className={cn("h-5 px-1.5 text-[0.6rem]", status.className)}
          >
            {status.label}
          </Badge>
          {doc.pageNum ? (
            <span className="text-[0.65rem] text-muted-foreground">
              {doc.pageNum} pages
            </span>
          ) : null}
        </div>
      </div>

      {/* Delete */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1.5 right-1.5 size-6 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <X />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{doc.name ?? doc.id}&rdquo;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(doc.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
})

export function DocumentList({
  documents,
  selectedDocId,
  onSelect,
  onDelete,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-muted-foreground">
        <FileText className="size-10 opacity-30" />
        <p className="text-sm">No documents yet</p>
        <p className="text-xs opacity-70">Upload a PDF to get started</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-0.5 px-2 py-1"
    >
      <AnimatePresence mode="popLayout">
        {documents.map((doc) => (
          <DocumentItem
            key={doc.id}
            doc={doc}
            isSelected={selectedDocId === doc.id}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
