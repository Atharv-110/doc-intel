// =====================================================
// DocIntel — Zod Schemas for API Input Validation
// =====================================================
// All API route inputs are validated against these schemas
// before any business logic executes.

import { z } from "zod";

/** POST /api/config — configure the API key */
export const configSchema = z.object({
  apiKey: z
    .string({ message: "API key is required" })
    .trim()
    .min(1, "API key cannot be empty"),
});

/** POST /api/chat — chat with a document */
export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1, "Message content cannot be empty"),
      }),
    )
    .min(1, "At least one message is required"),
  doc_id: z
    .string({ message: "doc_id is required" })
    .min(1, "doc_id cannot be empty"),
});

/** GET /api/documents — list documents */
export const listDocumentsSchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

/** Dynamic route params — document ID */
export const docIdParamsSchema = z.object({
  id: z.string().min(1, "Document ID is required"),
});

/** File upload constraints */
export const UPLOAD_LIMITS = {
  maxSizeBytes: 50 * 1024 * 1024, // 50 MB
  allowedMimeTypes: ["application/pdf"] as const,
  maxSizeMB: 50,
} as const;
