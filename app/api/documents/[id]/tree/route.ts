// GET /api/documents/[id]/tree — Get the hierarchical tree structure
//
// Returns the PageIndex-generated tree for a specific document.
// This is the core of "vectorless RAG" — the tree IS the index.

import { NextResponse } from "next/server";
import { requireClient } from "@/lib/pageindex-client";
import { docIdParamsSchema } from "@/lib/validations";

/** Tree data changes as documents process — never cache. */
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. Auth guard
  const { client, error } = requireClient(_request);
  if (error) return error;

  try {
    // 2. Validate route params
    const rawParams = await params;
    const parsed = docIdParamsSchema.safeParse(rawParams);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid document ID", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // 3. Fetch tree from PageIndex
    const tree = await client.api.getTree(parsed.data.id);
    return NextResponse.json(tree);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to get tree", message },
      { status: 500 },
    );
  }
}
