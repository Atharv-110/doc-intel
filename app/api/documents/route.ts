// GET /api/documents — List all uploaded documents
//
// Supports pagination via `limit` and `offset` query params.
// Defaults: limit=20, offset=0. Max limit: 100.

import { NextResponse } from "next/server";
import { requireClient } from "@/lib/pageindex-client";
import { listDocumentsSchema } from "@/lib/validations";

/** Document list changes at runtime — never cache. */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Auth guard
  const { client, error } = requireClient(request);
  if (error) return error;

  try {
    // 2. Parse and validate query params
    const { searchParams } = new URL(request.url);
    const parsed = listDocumentsSchema.safeParse({
      limit: searchParams.get("limit") ?? undefined,
      offset: searchParams.get("offset") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // 3. Fetch from PageIndex
    const result = await client.api.listDocuments({
      limit: parsed.data.limit,
      offset: parsed.data.offset,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to list documents", message },
      { status: 500 },
    );
  }
}
