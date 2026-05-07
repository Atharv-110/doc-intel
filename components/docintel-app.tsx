"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useApiKey } from "@/hooks/use-api-key"
import { useDocuments } from "@/hooks/use-documents"
import { useTree } from "@/hooks/use-tree"
import { useChat } from "@/hooks/use-chat"
import { ApiKeyOverlay } from "@/components/api-key-overlay"
import { AppHeader } from "@/components/app-header"
import { DocumentsPanel } from "@/components/documents-panel"
import { CenterPanel } from "@/components/center-panel"
import { InsightsPanel } from "@/components/insights-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeIn } from "@/lib/transitions"

export function DocIntelApp() {
  const {
    isConfigured,
    isLoading: authLoading,
    error: authError,
    configure,
    reset,
  } = useApiKey()

  const { documents, selectedDoc, selectDocument, deleteDocument, refresh } =
    useDocuments(isConfigured, reset)

  const {
    treeData,
    isLoading: treeLoading,
    error: treeError,
    isProcessing: treeProcessing,
    stats: treeStats,
  } = useTree(selectedDoc?.id ?? null)

  const {
    messages: chatMessages,
    isStreaming,
    retrievalLog,
    sendMessage,
    resetChat,
    inputValue: chatInputValue,
    setInputValue: setChatInputValue,
  } = useChat(selectedDoc?.id ?? null, selectedDoc?.name ?? null)

  const [activeTab, setActiveTab] = useState("tree")

  const handleSelectDoc = useCallback(
    (doc: Parameters<typeof selectDocument>[0]) => {
      selectDocument(doc)
      resetChat()
      setActiveTab("tree")
    },
    [selectDocument, resetChat]
  )

  const handleSendMessage = useCallback(
    (content: string) => {
      sendMessage(content)
      setActiveTab("chat")
    },
    [sendMessage]
  )

  // Loading splash
  if (authLoading) {
    return (
      <div className="flex h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="size-16 rounded-xl" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    )
  }

  // API key overlay
  if (!isConfigured) {
    return <ApiKeyOverlay onSubmit={configure} error={authError} />
  }

  // Main app
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex h-svh flex-col"
      >
        <AppHeader />

        <main className="flex min-h-0 flex-1 overflow-hidden">
          <DocumentsPanel
            documents={documents}
            selectedDocId={selectedDoc?.id ?? null}
            onSelect={handleSelectDoc}
            onDelete={deleteDocument}
            onRefresh={refresh}
            onUploadComplete={refresh}
          />

          <CenterPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            treeData={treeData}
            treeLoading={treeLoading}
            treeError={treeError}
            treeProcessing={treeProcessing}
            treeStats={treeStats}
            docName={selectedDoc?.name ?? null}
            chatMessages={chatMessages}
            isStreaming={isStreaming}
            hasSelectedDoc={!!selectedDoc}
            onSendMessage={handleSendMessage}
            chatInputValue={chatInputValue}
            setChatInputValue={setChatInputValue}
          />

          <InsightsPanel retrievalLog={retrievalLog} />
        </main>
      </motion.div>
    </AnimatePresence>
  )
}
