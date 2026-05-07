"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { staggerItem } from "@/lib/transitions"
import type { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Send } from "lucide-react"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// --- Message component ---

const ChatBubble = memo(function ChatBubble({
  message,
}: {
  message: ChatMessage
  isStreaming: boolean
}) {
  const isUser = message.role === "user"
  const isEmpty = !message.content && !isUser

  // Pre-process AI content to convert <physical_index_X> to markdown links
  const processedContent = isUser
    ? message.content
    : message.content.replace(/<physical_index_(\d+)>/g, "[p.$1](#citation-$1)")

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      className="flex gap-3"
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md text-[0.65rem] font-bold",
          isUser
            ? "bg-foreground text-background"
            : "border border-primary/20 bg-primary/10 text-primary"
        )}
      >
        {isUser ? "You" : "AI"}
      </div>

      {/* Bubble */}
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[0.65rem] font-semibold tracking-wider text-muted-foreground uppercase">
          {isUser ? "You" : "DocIntel"}
        </p>
        {isEmpty ? (
          <div className="inline-flex gap-1 py-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_li]:mb-0.5 [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:my-1.5 [&_ul]:pl-5">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children, ...props }) => {
                    if (href?.startsWith("#citation-")) {
                      return (
                        <span className="inline-flex items-center gap-1 rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 align-middle font-mono text-[0.65rem] font-semibold text-primary">
                          📄 {children}
                        </span>
                      )
                    }
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    )
                  },
                }}
              >
                {processedContent}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
})

// --- Main ChatView ---

interface ChatViewProps {
  messages: ChatMessage[]
  isStreaming: boolean
  hasSelectedDoc: boolean
  onSendMessage: (content: string) => void
}

export function ChatView({
  messages,
  isStreaming,
  hasSelectedDoc,
  onSendMessage,
}: ChatViewProps) {
  const [inputValue, setInputValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isStreaming) return
    onSendMessage(inputValue.trim())
    setInputValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [inputValue, isStreaming, onSendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            className="text-primary opacity-40"
          >
            <path
              d="M8 12a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H20L8 56V12z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M20 20h24M20 28h16M20 36h20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
          <h3 className="text-base font-semibold">Chat with Your Document</h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {hasSelectedDoc ? (
              <>
                Ask questions using natural language.
                <br />
                Answers are powered by{" "}
                <strong className="text-foreground">
                  tree-based retrieval
                </strong>{" "}
                with page-level citations.
              </>
            ) : (
              <>
                Select a document first, then ask questions.
                <br />
                Powered by{" "}
                <strong className="text-foreground">Vectorless RAG</strong>.
              </>
            )}
          </p>
        </div>

        {/* Input area (only if doc selected) */}
        {hasSelectedDoc ? (
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            onKeyDown={handleKeyDown}
            isStreaming={isStreaming}
            textareaRef={textareaRef}
          />
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-5 overflow-y-auto p-5"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <ChatBubble
              key={idx}
              message={msg}
              isStreaming={isStreaming && idx === messages.length - 1}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        isStreaming={isStreaming}
        textareaRef={textareaRef}
      />
    </div>
  )
}

// --- Chat Input ---

function ChatInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  isStreaming,
  textareaRef,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  isStreaming: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}) {
  return (
    <div className="shrink-0 border-t border-border px-5 pt-3 pb-4">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            // Auto-resize
            e.target.style.height = "auto"
            e.target.style.height = e.target.scrollHeight + "px"
          }}
          onKeyDown={onKeyDown}
          placeholder="Ask a question about this document…"
          className="max-h-[120px] min-h-[24px] flex-1 resize-none border-0 bg-transparent p-1 text-sm shadow-none focus-visible:ring-0"
          rows={1}
          id="chat-input"
        />
        <Button
          size="icon"
          className="size-8 shrink-0 rounded-lg"
          onClick={onSend}
          disabled={!value.trim() || isStreaming}
          id="chat-send"
        >
          <Send />
        </Button>
      </div>
      <p className="mt-1.5 text-center text-[0.6rem] text-muted-foreground">
        Press{" "}
        <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[0.55rem]">
          Enter
        </kbd>{" "}
        to send ·{" "}
        <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[0.55rem]">
          Shift+Enter
        </kbd>{" "}
        for new line
      </p>
    </div>
  )
}
