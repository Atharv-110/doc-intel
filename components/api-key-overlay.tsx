"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Particles } from "@/components/ui/particles"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

interface ApiKeyOverlayProps {
  onSubmit: (key: string) => Promise<void>
  error: string | null
}

export function ApiKeyOverlay({ onSubmit, error }: ApiKeyOverlayProps) {
  const [key, setKey] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { resolvedTheme } = useTheme()
  const [color, setColor] = useState("#ffffff")

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000")
    })
    return () => cancelAnimationFrame(frameId)
  }, [resolvedTheme])

  const handleSubmit = useCallback(async () => {
    if (!key.trim()) return
    setIsSubmitting(true)
    try {
      await onSubmit(key.trim())
    } catch {
      // Error is handled by the parent hook
    } finally {
      setIsSubmitting(false)
    }
  }, [key, onSubmit])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      >
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color={color}
          refresh
        />
        <div className="z-10 w-full max-w-md px-6">
          <BlurFade delay={0.1} inView>
            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-xl bg-primary/10">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  className="size-10 text-primary"
                >
                  <rect
                    x="2"
                    y="2"
                    width="36"
                    height="36"
                    rx="8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M12 12h6v6h-6zM22 12h6v6h-6zM12 22h6v6h-6zM22 22h6v6h-6z"
                    fill="currentColor"
                    opacity="0.5"
                  />
                  <path
                    d="M15 15v10M25 15v10M15 20h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">DocIntel</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enterprise Document Intelligence
              </p>
            </div>
          </BlurFade>

          {/* Description */}
          <BlurFade delay={0.2} inView>
            <div className="mb-8 text-center text-sm leading-relaxed text-muted-foreground">
              <p>
                Powered by{" "}
                <strong className="text-foreground">Vectorless RAG</strong> — no
                vector databases, no embeddings.
                <br />
                Just intelligent tree-structured document navigation.
              </p>
            </div>
          </BlurFade>

          {/* Form */}
          <BlurFade delay={0.3} inView>
            <div className="flex flex-col gap-4">
              <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                PageIndex API Key
              </label>
              <div className="flex flex-col gap-3">
                <Input
                  type="password"
                  placeholder="pi-xxxxxxxxxxxxxxxx"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit()
                  }}
                  className="h-12 font-mono"
                  autoComplete="off"
                  id="api-key-input"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!key.trim() || isSubmitting}
                  id="api-key-submit"
                  className="h-12 w-full text-base"
                >
                  {isSubmitting ? (
                    <Loader2
                      data-icon="inline-start"
                      className="mr-2 size-4 animate-spin"
                    />
                  ) : (
                    <ArrowRight
                      data-icon="inline-start"
                      className="mr-2 size-4"
                    />
                  )}
                  {isSubmitting ? "Connecting…" : "Connect"}
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Need a key? Generate one for the PageIndex SDK at{" "}
                <Link
                  href="https://dash.pageindex.ai/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  dash.pageindex.ai/api-keys
                </Link>
              </p>

              {error ? (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
            </div>
          </BlurFade>
        </div>
        <div className="absolute bottom-4 left-0 right-0 z-10 text-center text-[0.65rem] text-muted-foreground">
          © 2026 Atharv Vani.{" "}
          <Link
            href="https://github.com/atharvvani"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
