// POST /api/chat — Chat with a document using SSE streaming
//
// Accepts { messages, doc_id } in the request body. Opens a
// streaming SSE connection that forwards content, metadata,
// and finish events from the PageIndex SDK in real-time.
//
// SSE event format:
//   data: {"type":"content","content":"..."}
//   data: {"type":"metadata","metadata":{...}}
//   data: {"type":"finish","reason":"end_turn"}
//   data: {"type":"error","message":"..."}
//   data: [DONE]

import { NextResponse } from "next/server";
import { requireClient } from "@/lib/pageindex-client";
import { chatSchema } from "@/lib/validations";

/** Chat is always dynamic — SSE streaming, no caching. */
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

  const { messages, doc_id } = parsed.data;

  // 3. Create SSE stream using Web Streams API (native to Next.js)
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const chatStream = await client.api.chatCompletions({
          messages,
          doc_id,
          stream: true,
          stream_metadata: true,
          enable_citations: true,
        });

        for await (const chunk of chatStream) {
          // Forward metadata events (tool use, tool result, etc.)
          if (chunk.block_metadata) {
            const payload = JSON.stringify({
              type: "metadata",
              metadata: chunk.block_metadata,
            });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }

          // Forward content deltas
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            const payload = JSON.stringify({ type: "content", content });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }

          // Forward finish signal
          const finishReason = chunk.choices?.[0]?.finish_reason;
          if (finishReason) {
            const payload = JSON.stringify({
              type: "finish",
              reason: finishReason,
            });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
        }

        // Signal end of stream
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Stream error";
        const payload = JSON.stringify({ type: "error", message });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        controller.close();
      }
    },
  });

  // 4. Return SSE response with proper headers
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
