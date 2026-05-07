// POST /api/upload — Upload a PDF document for PageIndex processing
//
// Accepts multipart/form-data with a single `file` field.
// Validates file type (PDF only) and size (50 MB max), then
// submits the document to PageIndex via the SDK.

import { NextResponse } from "next/server";
import { requireClient } from "@/lib/pageindex-client";
import { UPLOAD_LIMITS } from "@/lib/validations";

/** Upload route — always dynamic (side-effects). */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // 1. Auth guard
  const { client, error } = requireClient(request);
  if (error) return error;

  try {
    // 2. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file");

    // 3. Validate file presence
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded", message: "Expected a file in the 'file' form field." },
        { status: 400 },
      );
    }

    // 4. Validate MIME type
    if (!UPLOAD_LIMITS.allowedMimeTypes.includes(file.type as typeof UPLOAD_LIMITS.allowedMimeTypes[number])) {
      return NextResponse.json(
        {
          error: "Invalid file type",
          message: `Only PDF files are accepted. Received: ${file.type}`,
        },
        { status: 400 },
      );
    }

    // 5. Validate file size
    if (file.size > UPLOAD_LIMITS.maxSizeBytes) {
      return NextResponse.json(
        {
          error: "File too large",
          message: `Maximum file size is ${UPLOAD_LIMITS.maxSizeMB} MB. Received: ${(file.size / 1024 / 1024).toFixed(1)} MB`,
        },
        { status: 413 },
      );
    }

    // 6. Submit to PageIndex
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await client.api.submitDocument(buffer, file.name);

    return NextResponse.json(
      {
        success: true,
        doc_id: result.doc_id,
        filename: file.name,
        message: "Document submitted for processing",
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Upload failed", message },
      { status: 500 },
    );
  }
}
