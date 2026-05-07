// =====================================================
// DocIntel — API Client Wrappers
// =====================================================

import { API } from "@/lib/types";
import type { Document, TreeResponse } from "@/lib/types";
import { apiClient } from "@/lib/api-client";

/** Fetch all documents */
export async function fetchDocuments(limit?: number): Promise<Document[]> {
  const url = limit ? `${API.documents}?limit=${limit}` : API.documents;
  // Response from API is expected to be { documents: Document[] }
  const res = await apiClient.get<{ documents: Document[] }>(url);
  return res.data.documents ?? [];
}

/** Fetch a single document (used for polling) */
export async function fetchDocument(docId: string): Promise<Document> {
  const res = await apiClient.get<Document>(`${API.documents}/${docId}`);
  return res.data;
}

/** Delete a document */
export async function deleteDocumentApi(docId: string): Promise<void> {
  await apiClient.delete(`${API.documents}/${docId}`);
}

/** Upload a PDF file */
export async function uploadDocument(
  file: File,
): Promise<{ doc_id: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post<{ doc_id: string; filename: string }>(
    API.upload,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}

/** Fetch the tree structure for a document */
export async function fetchTree(docId: string): Promise<TreeResponse> {
  const res = await apiClient.get<TreeResponse>(`${API.documents}/${docId}/tree`);
  return res.data;
}
