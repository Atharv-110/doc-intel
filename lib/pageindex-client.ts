// =====================================================
// DocIntel — PageIndex Client (Server-side)
// =====================================================
//
// This module provides a helper to dynamically instantiate the
// PageIndex SDK client on a per-request basis by extracting
// the API key from the Authorization Bearer token header.
// This is a stateless, production-ready architecture.

import { PageIndexClient } from "@pageindex/sdk";
import { NextResponse } from "next/server";

export function getClientFromRequest(request: Request): InstanceType<typeof PageIndexClient> | null {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  
  const apiKey = authHeader.split(" ")[1];
  
  if (!apiKey || apiKey === "your_api_key_here") {
    return null;
  }
  
  return new PageIndexClient({ apiKey });
}

type RequireClientResult =
  | { client: InstanceType<typeof PageIndexClient>; error: null }
  | { client: null; error: NextResponse };

/**
 * Guard that every protected route calls at the top.
 * Returns the dynamically instantiated client or a pre-built 401 response.
 *
 * @example
 * ```ts
 * const { client, error } = requireClient(request);
 * if (error) return error;
 * // `client` is safely non-null here
 * ```
 */
export function requireClient(request: Request): RequireClientResult {
  const client = getClientFromRequest(request);

  if (!client) {
    return {
      client: null,
      error: NextResponse.json(
        {
          error: "Unauthorized",
          message: "Valid API key required in Authorization Bearer header.",
        },
        { status: 401 },
      ),
    };
  }

  return { client, error: null };
}
