"use client"

import type React from "react"
import { useState, useRef } from "react"
import type { Prompt, RecommendedPrompt, AnalysisState } from "@/lib/types"
import { Header } from "@/components/prompt-analyzer/Header"
import { InputSection } from "@/components/prompt-analyzer/InputSection"
import { ProcessingState } from "@/components/prompt-analyzer/ProcessingState"
import { RecommendationsSection } from "@/components/prompt-analyzer/RecommendationsSection"
import { STEP_TIMINGS } from "@/lib/constants"

export default function NotionPromptAnalyzer() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle")
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [domain, setDomain] = useState("")
  const [recommendations, setRecommendations] = useState<RecommendedPrompt[]>([])
  const [domainError, setDomainError] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPrompt, setSelectedPrompt] = useState<RecommendedPrompt | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const processingRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const promptsRef = useRef<HTMLDivElement>(null)
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const validateDomain = (url: string) => {
    const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/.*)?$/
    return domainRegex.test(url)
  }

  const handleDomainChange = (value: string) => {
    setDomain(value)
    if (value && !validateDomain(value)) {
      setDomainError("Please enter a valid domain (e.g., example.com or https://example.com)")
    } else {
      setDomainError("")
    }
  }

  const resetInterface = () => {
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current)
    setAnalysisState("idle")
    setPrompts([])
    setDomain("")
    setRecommendations([])
    setDomainError("")
    setCurrentStep(0)
    setSelectedPrompt(null)
    setCopiedId(null)
    setIsUploading(false)
  }

  const loadSampleData = () => {
    resetInterface()
    setDomain("stripe.com")
    setPrompts([
      { id: "1", text: "Best Stripe alternatives" },
      { id: "2", text: "Best platform for international transactions" },
      { id: "3", text: "What security features does Stripe offer for payment processing?" },
      { id: "4", text: "How to integrate payments in e-commerce platforms?" },
      { id: "5", text: "What are Stripe fees compared to other payment processors?" },
    ])
    setTimeout(() => {
      promptsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
  }

  const handleAddPrompt = (text: string) => {
    const promptTexts = text
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
    const newPrompts: Prompt[] = promptTexts.map((t) => ({ id: Date.now().toString() + Math.random(), text: t }))
    setPrompts((prev) => [...prev, ...newPrompts])
  }

  const addPromptsGradually = async (newPrompts: Prompt[]) => {
    for (const prompt of newPrompts) {
      setPrompts((prev) => [...prev, prompt])
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("Please upload a CSV file only.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.")
      return
    }

    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const csvContent = e.target?.result as string
      const lines = csvContent.split("\n").filter((line) => line.trim())
      const newPrompts: Prompt[] = lines
        .map((line) => ({ id: Date.now().toString() + Math.random(), text: line.replace(/"/g, "").trim() }))
        .filter((p) => p.text.length > 0)
      await addPromptsGradually(newPrompts)
      setIsUploading(false)
    }
    reader.readAsText(file)
    if (event.target) event.target.value = ""
  }

  const handleRemovePrompt = (id: string) => setPrompts(prompts.filter((p) => p.id !== id))
  const handleUpdatePrompt = (id: string, text: string) =>
    setPrompts(prompts.map((p) => (p.id === id ? { ...p, text } : p)))

  const cleanupStepAnimation = () => {
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current)
      stepTimeoutRef.current = null
    }
  }

  const getRecommendations = async () => {
    if (!domain || domainError || prompts.length < 5) {
      alert("Please add at least 5 prompts for analysis")
      return
    }

    setAnalysisState("processing")
    setCurrentStep(0)
    setSelectedPrompt(null)

    setTimeout(() => {
      processingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)

    // Realistic step timing animation
    const animateSteps = (stepIndex = 0) => {
      if (stepIndex < STEP_TIMINGS.length) {
        setCurrentStep(stepIndex)
        stepTimeoutRef.current = setTimeout(() => {
          animateSteps(stepIndex + 1)
        }, STEP_TIMINGS[stepIndex])
      }
    }
    animateSteps()

    try {
      const payload = { domain: domain.trim(), prompts: prompts.map((p) => p.text) }
      const startResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const startData = await startResponse.json()
      if (!startResponse.ok || !startData.success) throw new Error(startData.message || "Failed to start analysis.")
      const { sessionId } = startData

      let attempts = 0
      const maxAttempts = 60
      const pollInterval = 5000

      while (attempts < maxAttempts) {
        attempts++
        await new Promise((resolve) => setTimeout(resolve, pollInterval))
        const statusResponse = await fetch(`/api/results/${sessionId}`)
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          if (statusData.success && statusData.complete) {
            cleanupStepAnimation()
            setRecommendations(statusData.top_prompts)
            setAnalysisState("complete")
            setTimeout(() => {
              resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
            }, 300)
            return
          }
        }
      }
      throw new Error("Analysis timed out after 5 minutes. Please try again.")
    } catch (error) {
      cleanupStepAnimation()
      setAnalysisState("idle")
      const message = error instanceof Error ? error.message : "An unknown error occurred."
      alert(`Error: ${message}`)
    }
  }

  const handleCopyPrompt = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleAddRecommendedPrompt = (rec: RecommendedPrompt) => {
    const newPrompt: Prompt = { id: Date.now().toString(), text: rec.prompt_text }
    setPrompts((prev) => [...prev, newPrompt])
  }

  const canGetRecommendations = domain && !domainError && prompts.length >= 5

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <Header onReset={resetInterface} onLoadSampleData={loadSampleData} />

        <div ref={promptsRef}>
          <InputSection
            domain={domain}
            onDomainChange={handleDomainChange}
            domainError={domainError}
            prompts={prompts}
            onAddPrompt={handleAddPrompt}
            onFileUpload={handleFileUpload}
            onRemovePrompt={handleRemovePrompt}
            onUpdatePrompt={handleUpdatePrompt}
            isUploading={isUploading}
            canGetRecommendations={canGetRecommendations}
            analysisState={analysisState}
            onGetRecommendations={getRecommendations}
          />
        </div>

        {analysisState === "processing" && (
          <div ref={processingRef}>
            <ProcessingState currentStep={currentStep} />
          </div>
        )}

        {analysisState === "complete" && recommendations.length > 0 && (
          <div ref={resultsRef}>
            <RecommendationsSection
              recommendations={recommendations}
              selectedPrompt={selectedPrompt}
              copiedId={copiedId}
              onSelectPrompt={setSelectedPrompt}
              onCopyPrompt={handleCopyPrompt}
              onAddRecommendedPrompt={handleAddRecommendedPrompt}
            />
          </div>
        )}
      </div>
    </div>
  )
}
