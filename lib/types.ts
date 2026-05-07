// =====================================================
// DocIntel — Type Definitions
// =====================================================

/** API endpoint paths (relative to origin) */
export const API = {
  config: "/api/config",
  configStatus: "/api/config/status",
  upload: "/api/upload",
  documents: "/api/documents",
  chat: "/api/chat",
  chatSync: "/api/chat/sync",
} as const;

/** Document from the PageIndex API */
export interface Document {
  id: string;
  name?: string;
  status: "queued" | "processing" | "completed" | "failed";
  pageNum?: number;
}

/** Recursive tree node from PageIndex */
export interface TreeNode {
  title?: string;
  text?: string;
  page_index?: number;
  nodes?: TreeNode[];
}

/** Tree response from the API */
export interface TreeResponse {
  status: string;
  result?: TreeNode[];
  doc_id?: string;
}

/** Chat message */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** SSE chunk types from the chat endpoint */
export type ChatStreamChunk =
  | { type: "content"; content: string }
  | { type: "metadata"; metadata: StreamMetadata }
  | { type: "error"; message: string }
  | { type: "finish"; reason: string };

/** Metadata events from the streaming chat */
export interface StreamMetadata {
  type:
    | "mcp_tool_use_start"
    | "mcp_tool_use_stop"
    | "mcp_tool_result_start"
    | "text_block_start";
  tool_name?: string;
}

/** Retrieval log entry for the insights panel */
export interface RetrievalLogEntry {
  id: string;
  variant: "tool-use" | "tool-result" | "text-start" | "completed";
  text: string;
  isActive?: boolean;
}

/** Stats computed from tree data */
export interface TreeStats {
  totalNodes: number;
  maxDepth: number;
  rootSections: number;
}
