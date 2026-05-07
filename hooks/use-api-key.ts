"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { fetchDocuments } from "@/lib/api";
import { ApiError } from "@/lib/api-client";

/**
 * Manages API key lifecycle — reading from localStorage,
 * validating it against the API, and persisting it.
 */
export function useApiKey() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const checkedRef = useRef(false);

  // Check status on mount — only once
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    async function check() {
      try {
        const savedKey = localStorage.getItem("pageindex_api_key");
        if (savedKey) {
          // Validate key by attempting a small fetch
          // We don't actually need the docs, just to see if it 401s
          await fetchDocuments(1); 
          setIsConfigured(true);
        }
      } catch {
        // Validation failed, key is invalid or network error
        localStorage.removeItem("pageindex_api_key");
      } finally {
        setIsLoading(false);
      }
    }

    check();
  }, []);

  const configure = useCallback(async (key: string) => {
    setError(null);
    try {
      // Optimistically save it so fetchDocuments picks it up
      localStorage.setItem("pageindex_api_key", key);
      
      // Validate the new key
      await fetchDocuments(1);
      
      setIsConfigured(true);
    } catch (err) {
      // Rollback if invalid
      localStorage.removeItem("pageindex_api_key");
      
      let message = "Failed to configure API key";
      if (err instanceof ApiError) {
        message = err.code === "UNAUTHORIZED" ? "Invalid API key" : err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem("pageindex_api_key");
    setIsConfigured(false);
    setError(null);
  }, []);

  return { isConfigured, isLoading, error, configure, reset };
}
