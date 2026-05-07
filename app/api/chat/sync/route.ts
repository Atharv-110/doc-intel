// POST /api/chat/sync — Non-streaming chat fallback
//
// Returns a complete JSON response instead of SSE streaming.
// Useful for environments where SSE is not supported.

import { NextResponse } from "next/server";
import { requireClient } from "@/lib/pageindex-client";
import { chatSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // 1. Auth guard
  const { client, error } = requireClient(request);
  if (error) return error;

  // 2. Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const response = await client.api.chatCompletions({
      messages: parsed.data.messages,
      doc_id: parsed.data.doc_id,
      enable_citations: true,
    });

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Chat failed", message },
      { status: 500 },
    );
  }
}
