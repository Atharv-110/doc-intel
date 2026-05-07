"use client"

import { useState, useCallback, useEffect } from "react"
import { fetchTree } from "@/lib/api"
import type { TreeNode, TreeResponse, TreeStats } from "@/lib/types"

function countNodes(tree: TreeNode[]): number {
  let count = 0
  for (const node of tree) {
    count++
    if (node.nodes) count += countNodes(node.nodes)
  }
  return count
}

function getMaxDepth(tree: TreeNode[], depth = 0): number {
  let max = depth
  for (const node of tree) {
    if (node.nodes && node.nodes.length > 0) {
      const childDepth = getMaxDepth(node.nodes, depth + 1)
      if (childDepth > max) max = childDepth
    }
  }
  return max
}

/**
 * Manages fetching and computing stats for a document's tree structure.
 */
export function useTree(docId: string | null) {
  const [treeData, setTreeData] = useState<TreeNode[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState<TreeStats | null>(null)

  const loadTree = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    setTreeData(null)
    setIsProcessing(false)

    try {
      const data: TreeResponse = await fetchTree(id)

      if (data.status === "completed" && data.result) {
        setTreeData(data.result)
        setStats({
          totalNodes: countNodes(data.result),
          maxDepth: getMaxDepth(data.result) + 1,
          rootSections: data.result.length,
        })
      } else if (data.status === "processing") {
        setIsProcessing(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tree")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (docId) {
        loadTree(docId)
      } else {
        setTreeData(null)
        setStats(null)
        setError(null)
        setIsProcessing(false)
      }
    })
    return () => cancelAnimationFrame(frameId)
  }, [docId, loadTree])

  return { treeData, isLoading, error, isProcessing, stats }
}
