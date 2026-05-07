// GET/DELETE /api/documents/[id] — Get or delete a specific document
//
// GET  → Returns the document metadata (name, status, page count)
// DELETE → Removes the document from PageIndex

import { NextResponse } from "next/server";
import { requireClient } from "@/lib/pageindex-client";
import { docIdParamsSchema } from "@/lib/validations";

/** Document state changes at runtime — never cache. */
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

    // 3. Fetch from PageIndex
    const doc = await client.api.getDocument(parsed.data.id);
    return NextResponse.json(doc);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to get document", message },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    // 3. Delete from PageIndex
    await client.api.deleteDocument(parsed.data.id);

    return NextResponse.json({
      success: true,
      message: "Document deleted",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to delete document", message },
      { status: 500 },
    );
  }
}
