"use client";

import { useState, useCallback, useRef } from "react";
import type {
  ChatMessage,
  ChatStreamChunk,
  RetrievalLogEntry,
} from "@/lib/types";
import { API } from "@/lib/types";
import { streamClient } from "@/lib/api-client";

let logIdCounter = 0;

function createLogEntry(
  variant: RetrievalLogEntry["variant"],
  text: string,
  isActive = false,
): RetrievalLogEntry {
  return { id: String(++logIdCounter), variant, text, isActive };
}

/**
 * Manages chat state — messages, streaming, and retrieval log.
 */
export function useChat(docId: string | null, docName: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [retrievalLog, setRetrievalLog] = useState<RetrievalLogEntry[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const addLogEntry = useCallback(
    (variant: RetrievalLogEntry["variant"], text: string, isActive = false) => {
      setRetrievalLog((prev) => [...prev, createLogEntry(variant, text, isActive)]);
    },
    [],
  );

  const deactivateLastLog = useCallback(() => {
    setRetrievalLog((prev) => {
      const lastActiveIdx = prev.findLastIndex((e) => e.isActive);
      if (lastActiveIdx === -1) return prev;
      const updated = [...prev];
      updated[lastActiveIdx] = { ...updated[lastActiveIdx], isActive: false };
      return updated;
    });
  }, []);

  const deactivateAllLogs = useCallback(() => {
    setRetrievalLog((prev) => prev.map((log) => ({ ...log, isActive: false })));
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !docId || isStreaming) return;

      const userMessage: ChatMessage = { role: "user", content };
      const currentMessages = [...messages, userMessage];
      setMessages(currentMessages);

      // Clear retrieval log for new query
      setRetrievalLog([
        createLogEntry(
          "text-start",
          `🔍 New query on "${docName ?? docId}"`,
        ),
      ]);

      setIsStreaming(true);

      // Create placeholder for assistant
      const assistantMessage: ChatMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await streamClient.post(API.chat, {
          messages: currentMessages,
          doc_id: docId,
        }, {
          signal: controller.signal,
        });

        const stream = response.data as unknown as ReadableStream<Uint8Array>;
        if (!stream || !stream.getReader) throw new Error("No response body stream");
        const reader = stream.getReader();

        const decoder = new TextDecoder();
        let buffer = "";
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") continue;

            try {
              const data: ChatStreamChunk = JSON.parse(payload);

              if (data.type === "content") {
                fullContent += data.content;
                // Functional setState — no stale closures
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: fullContent,
                  };
                  return updated;
                });
              }

              if (data.type === "metadata") {
                const meta = data.metadata;
                if (meta.type === "mcp_tool_use_start") {
                  addLogEntry(
                    "tool-use",
                    `🌲 Navigating tree using "${meta.tool_name ?? "tree_search"}"`,
                    true,
                  );
                }
                if (meta.type === "mcp_tool_use_stop") {
                  deactivateLastLog();
                }
                if (meta.type === "mcp_tool_result_start") {
                  addLogEntry(
                    "tool-result",
                    "✅ Retrieved relevant content from tree",
                  );
                }
                if (meta.type === "text_block_start") {
                  addLogEntry(
                    "text-start",
                    "💬 Generating answer from retrieved context",
                  );
                }
              }

              if (data.type === "error") {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: `Error: ${data.message}`,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }

        deactivateAllLogs();
        addLogEntry("completed", "✓ Response generation complete");
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const errorMsg =
          err instanceof Error ? err.message : "Connection error";
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: `Connection error: ${errorMsg}`,
          };
          return updated;
        });
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [docId, docName, isStreaming, messages, addLogEntry, deactivateLastLog, deactivateAllLogs],
  );

  const resetChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setRetrievalLog([]);
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, retrievalLog, sendMessage, resetChat };
}
