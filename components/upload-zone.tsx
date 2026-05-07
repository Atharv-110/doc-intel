"use client"

import { useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { uploadDocument } from "@/lib/api"

interface UploadZoneProps {
  onUploadComplete: () => void
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        setStatusText("Only PDF files are accepted.")
        setTimeout(() => setStatusText(""), 3000)
        return
      }

      setIsUploading(true)
      setProgress(30)
      setStatusText("Uploading document…")

      try {
        setProgress(60)
        await uploadDocument(file)
        setProgress(100)
        setStatusText("Processing started!")

        setTimeout(() => {
          setIsUploading(false)
          setProgress(0)
          setStatusText("")
          onUploadComplete()
        }, 1500)
      } catch (err) {
        setStatusText(
          `Error: ${err instanceof Error ? err.message : "Upload failed"}`
        )
        setProgress(0)
        setTimeout(() => {
          setIsUploading(false)
          setStatusText("")
        }, 3000)
      }
    },
    [onUploadComplete]
  )

  return (
    <motion.div
      whileHover={{ scale: isUploading ? 1 : 1.01 }}
      whileTap={{ scale: isUploading ? 1 : 0.99 }}
      className={cn(
        "mx-3 mt-3 cursor-pointer rounded-none border-2 border-dashed bg-card p-5 text-center transition-colors",
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
        isUploading && "pointer-events-none"
      )}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleUpload(file)
      }}
      id="upload-zone"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
          e.target.value = ""
        }}
      />

      {isUploading ? (
        <div className="flex flex-col gap-3">
          <Progress value={progress} className="h-1" />
          <p className="text-xs font-medium text-primary">{statusText}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className="size-7 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Drop PDF here or{" "}
            <strong className="text-primary">click to upload</strong>
          </p>
          <p className="text-[0.65rem] text-muted-foreground/70">
            Max 50MB · PDF only
          </p>
        </div>
      )}
    </motion.div>
  )
}
