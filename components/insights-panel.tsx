"use client";

import { motion } from "framer-motion";
import { Info, LayoutPanelLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { slideInRight, staggerContainer, staggerItem, logEntryVariant } from "@/lib/transitions";
import type { RetrievalLogEntry } from "@/lib/types";

interface InsightsPanelProps {
  retrievalLog: RetrievalLogEntry[];
}

const STEPS = [
  {
    num: 1,
    title: "Tree Indexing",
    desc: "Document parsed into a hierarchical tree — like an intelligent table of contents",
  },
  {
    num: 2,
    title: "LLM Navigation",
    desc: "Instead of vector similarity, an LLM navigates the tree using reasoning to find relevant sections",
  },
  {
    num: 3,
    title: "Precise Retrieval",
    desc: "Exact sections retrieved with page-level precision — no chunking artifacts",
  },
];

const COMPARISON = [
  { label: "Embeddings", vector: "Required", vectorless: "None" },
  { label: "Vector DB", vector: "Required", vectorless: "None" },
  { label: "Chunking", vector: "Manual", vectorless: "Auto Tree" },
  { label: "Retrieval", vector: "Similarity", vectorless: "Reasoning" },
  { label: "Context", vector: "Fragmented", vectorless: "Hierarchical" },
];

const LOG_STYLES: Record<string, string> = {
  "tool-use": "border-primary/30 bg-primary/5 text-primary",
  "tool-result": "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400",
  "text-start": "border-border bg-muted/50 text-muted-foreground",
  "completed": "border-primary bg-primary/10 text-primary font-medium",
};

export function InsightsPanel({ retrievalLog }: InsightsPanelProps) {
  return (
    <motion.aside
      variants={slideInRight}
      initial="hidden"
      animate="visible"
      className="hidden w-76 shrink-0 flex-col overflow-hidden border-l border-border bg-muted/30 lg:flex"
      id="insights-panel"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Retrieval Insights
        </h2>
        <Badge variant="secondary" className="text-[0.6rem]">Live</Badge>
      </div>

      {/* Description */}
      <div className="border-b border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        Watch how <strong className="text-foreground">Vectorless RAG</strong> works
        in real-time. No vector similarity search — just intelligent tree navigation.
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 p-3">
          {/* How it works */}
          <Card>
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="flex items-center gap-2 text-xs">
                <Info className="text-primary" />
                How Vectorless RAG Works
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {STEPS.map((step) => (
                  <motion.div key={step.num} variants={staggerItem} className="flex gap-2.5">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[0.6rem] font-bold text-primary">
                      {step.num}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold">{step.title}</p>
                      <p className="text-[0.65rem] leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>

          {/* Retrieval log */}
          {retrievalLog.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-1"
            >
              {retrievalLog.map((entry) => (
                <motion.div
                  key={entry.id}
                  variants={logEntryVariant}
                  initial="hidden"
                  animate="visible"
                  className={cn(
                    "flex items-start gap-1.5 rounded-md border px-2.5 py-2 text-[0.7rem]",
                    LOG_STYLES[entry.variant],
                    entry.isActive && "border-primary",
                  )}
                >
                  <span className="flex-1">{entry.text}</span>
                  {entry.isActive ? (
                    <div className="mt-0.5 size-3 shrink-0 animate-spin rounded-full border-2 border-transparent border-t-current" />
                  ) : null}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-5 text-center text-xs text-muted-foreground opacity-60">
              Ask a question to see live retrieval
            </div>
          )}

          {/* Comparison card */}
          <Card>
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="flex items-center gap-2 text-xs">
                <LayoutPanelLeft className="text-primary" />
                Vector RAG vs Vectorless RAG
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              {/* Header row */}
              <div className="mb-1 grid grid-cols-[1fr_0.7fr_0.7fr] gap-1 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
                <span />
                <span>Vector</span>
                <span>Vectorless</span>
              </div>
              {COMPARISON.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_0.7fr_0.7fr] gap-1 border-t border-border py-1.5 text-[0.7rem]"
                >
                  <span className="font-medium text-muted-foreground">{row.label}</span>
                  <span className="text-muted-foreground/70">{row.vector}</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {row.vectorless}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.aside>
  );
}
