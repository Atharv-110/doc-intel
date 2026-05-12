"use client"

import { CommonHeader } from "@/components/common-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Marquee } from "@/components/ui/marquee"
import { SparklesText } from "@/components/ui/sparkles-text"
import { TextAnimate } from "@/components/ui/text-animate"
import { fadeInUp, slideInRight, staggerContainer } from "@/lib/transitions"
import { motion } from "framer-motion"
import { ArrowRight, Check, FileText, Globe, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useCallback, useState } from "react"

interface LandingScreenProps {
  onConnect: (key: string) => Promise<void>
  error: string | null
}

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant document navigation with no indexing delays",
  },
  {
    icon: Shield,
    title: "Enterprise Secure",
    description: "Your data stays private, never leaves your control",
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Access your documents from anywhere, anytime",
  },
  {
    icon: FileText,
    title: "Smart Parsing",
    description: "Automatic document structure recognition",
  },
  {
    icon: Check,
    title: "Accurate Results",
    description: "Precise tree-structured navigation",
  },
  {
    icon: ArrowRight,
    title: "Effortless Setup",
    description: "Get started in minutes with your API key",
  },
]

const marqueeContent = [...features, ...features].map((feature, i) => (
  <div key={i} className="mx-8 flex items-center gap-3">
    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
      <feature.icon className="size-4 text-primary" />
    </div>
    <span className="text-sm font-medium text-muted-foreground">
      {feature.title}
    </span>
  </div>
))

export function LandingScreen({ onConnect, error }: LandingScreenProps) {
  const [apiKey, setApiKey] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (apiKey.trim()) {
        setIsSubmitting(true)
        try {
          await onConnect(apiKey.trim())
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [apiKey, onConnect]
  )

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="relative flex min-h-svh flex-col overflow-auto bg-background"
    >
      <CommonHeader showThemeToggle />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="flex w-full max-w-5xl flex-col gap-8 md:gap-12">
          {/* Hero Section */}
          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center gap-4 md:gap-6">
            <div className="flex size-20 items-center justify-center rounded-none">
              <Zap className="size-16 text-primary drop-shadow-xs drop-shadow-amber-100" />
            </div>
            <div className="max-w-3xl">
              <SparklesText className="text-5xl font-medium tracking-tight sm:text-7xl md:text-8xl">
                DocIntel
              </SparklesText>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="max-w-2xl text-center text-lg text-muted-foreground sm:text-xl">
                <TextAnimate
                  by="word"
                  animation="fadeIn"
                  duration={0.5}
                  className="w-full"
                >
                  Enterprise Document Intelligence Platform powered by Vectorless
                  RAG.
                </TextAnimate>
              </div>
              <div className="text-base text-muted-foreground">
                Intelligent tree-structured navigation without embeddings.
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          {/* <motion.div
            variants={staggerContainer}
            className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="group h-full rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                  <div className="mb-4 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="text-sm font-semibold transition-colors group-hover:text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground group-hover:text-muted-foreground/80">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div> */}

          {/* Marquee */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4 overflow-hidden"
          >
            <Marquee className="opacity-50">{marqueeContent}</Marquee>
            <Marquee reverse className="opacity-50">
              {marqueeContent}
            </Marquee>
          </motion.div>

          {/* API Key Entry Section */}
          <motion.div
            variants={slideInRight}
            transition={{ delay: 0.2 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="rounded-none border border-border bg-card p-8 shadow-xl shadow-muted-foreground/5">
              <h3 className="text-center text-base font-semibold text-foreground">
                Enter your API key to get started
              </h3>
              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Input
                    type="password"
                    placeholder="pi-xxxxxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="h-12 font-mono text-sm"
                    autoComplete="off"
                    id="landing-api-key-input"
                  />
                  <Button
                    type="submit"
                    disabled={!apiKey.trim() || isSubmitting}
                    className="h-12 w-full text-sm font-medium"
                    id="landing-api-key-submit"
                  >
                    {isSubmitting ? "Connecting…" : "Get Started"}
                    {!isSubmitting && (
                      <ArrowRight
                        data-icon="inline-end"
                        className="ml-2 size-4"
                      />
                    )}
                  </Button>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Need a key? Generate one at{" "}
                  <a
                    href="https://dash.pageindex.ai/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    dash.pageindex.ai/api-keys
                  </a>
                </p>
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </div>
          </motion.div>

          {/* Social Proof */}
          {/* <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Trusted by developers and enterprises
            </p>
          </motion.div> */}
        </div>
      </main>

      <footer className="w-full border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
        © 2026 Atharv Vani.{" "}
        <Link
          href="https://github.com/atharv-110"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          GitHub
        </Link>
      </footer>
    </motion.div>
  )
}
