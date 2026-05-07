"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { fetchDocuments, fetchDocument, deleteDocumentApi } from "@/lib/api"
import type { Document } from "@/lib/types"
import { ApiError } from "@/lib/api-client"

/**
 * Manages document list — fetching, selecting, deleting,
 * and polling for processing documents.
 */
export function useDocuments(
  isConfigured: boolean,
  onUnauthorized: () => void
) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const pollingIntervals = useRef<Map<string, ReturnType<typeof setInterval>>>(
    new Map()
  )

  const refresh = useCallback(async () => {
    if (!isConfigured) return
    setIsLoading(true)
    try {
      const docs = await fetchDocuments()
      setDocuments(docs)

      // Start polling for processing/queued docs
      docs.forEach((doc) => {
        if (
          (doc.status === "processing" || doc.status === "queued") &&
          !pollingIntervals.current.has(doc.id)
        ) {
          startPolling(doc.id)
        }
      })
    } catch (err) {
      if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
        onUnauthorized()
      }
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigured, onUnauthorized])

  // Load documents when API key becomes configured
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (isConfigured) {
        refresh()
      }
    })
    return () => cancelAnimationFrame(frameId)
  }, [isConfigured, refresh])

  // Cleanup all polling intervals on unmount
  useEffect(() => {
    const intervals = pollingIntervals.current
    return () => {
      intervals.forEach((interval) => clearInterval(interval))
      intervals.clear()
    }
  }, [])

  function startPolling(docId: string) {
    const interval = setInterval(async () => {
      try {
        const doc = await fetchDocument(docId)
        if (doc.status === "completed" || doc.status === "failed") {
          stopPolling(docId)
          refresh()
        }
      } catch {
        stopPolling(docId)
      }
    }, 3000)
    pollingIntervals.current.set(docId, interval)
  }

  function stopPolling(docId: string) {
    const interval = pollingIntervals.current.get(docId)
    if (interval) {
      clearInterval(interval)
      pollingIntervals.current.delete(docId)
    }
  }

  const selectDocument = useCallback((doc: Document) => {
    if (doc.status !== "completed") return
    setSelectedDoc(doc)
  }, [])

  const deleteDocument = useCallback(
    async (docId: string) => {
      try {
        await deleteDocumentApi(docId)
        if (selectedDoc?.id === docId) {
          setSelectedDoc(null)
        }
        stopPolling(docId)
        refresh()
      } catch (err) {
        console.error("Failed to delete:", err)
      }
    },
    [selectedDoc, refresh]
  )

  return {
    documents,
    selectedDoc,
    isLoading,
    selectDocument,
    deleteDocument,
    refresh,
  }
}
