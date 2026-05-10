"use client"

import { AppHeader } from "@/components/app-header"
import { CenterPanel } from "@/components/center-panel"
import { DocumentsPanel } from "@/components/documents-panel"
import { InsightsPanel } from "@/components/insights-panel"
import { LandingScreen } from "@/components/landing-screen"
import { Skeleton } from "@/components/ui/skeleton"
import { useApiKey } from "@/hooks/use-api-key"
import { useChat } from "@/hooks/use-chat"
import { useDocuments } from "@/hooks/use-documents"
import { useTree } from "@/hooks/use-tree"
import { fadeIn } from "@/lib/transitions"
import { motion } from "framer-motion"
import { useCallback, useState } from "react"

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

  const handleApiSubmit = useCallback(
    async (key: string) => {
      await configure(key)
    },
    [configure]
  )

  const handleResetApiKey = useCallback(() => {
    reset()
  }, [reset])

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

  // Show landing screen when not configured
  if (!isConfigured) {
    return (
      <motion.div
        key="landing"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex h-svh flex-col"
      >
        <LandingScreen onConnect={handleApiSubmit} error={authError} />
      </motion.div>
    )
  }

  // Main app with common header
  return (
    <motion.div
      key="app"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex h-svh flex-col"
    >
      <AppHeader showThemeToggle isConnected />
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
  )
}
