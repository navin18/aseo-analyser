"use client"

import type React from "react"

import { useState } from "react"
import type { Prompt, RecommendedPrompt, AnalysisState } from "@/lib/types"
import { Header } from "@/components/prompt-analyzer/Header"
import { InputSection } from "@/components/prompt-analyzer/InputSection"
import { ProcessingState } from "@/components/prompt-analyzer/ProcessingState"
import { RecommendationsSection } from "@/components/prompt-analyzer/RecommendationsSection"
import { PROCESSING_STEPS } from "@/lib/constants"

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

  const getRecommendations = async () => {
    if (!domain || domainError || prompts.length < 5) {
      alert("Please add at least 5 prompts for analysis")
      return
    }

    setAnalysisState("processing")
    setCurrentStep(0)

    const stepAnimationInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev))
    }, 20000) // ~2.5 minutes for all steps visually

    try {
      const payload = {
        domain: domain.trim(),
        prompts: prompts.map((p) => p.text),
      }

      const startResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const startData = await startResponse.json()
      if (!startResponse.ok || !startData.success) {
        throw new Error(startData.message || "Failed to start analysis.")
      }
      const { sessionId } = startData

      let attempts = 0
      const maxAttempts = 60 // 60 attempts * 5 seconds = 5 minutes
      const pollInterval = 5000

      while (attempts < maxAttempts) {
        attempts++
        await new Promise((resolve) => setTimeout(resolve, pollInterval))

        const statusResponse = await fetch(`/api/results/${sessionId}`)
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          if (statusData.success && statusData.complete) {
            clearInterval(stepAnimationInterval)
            setRecommendations(statusData.top_prompts)
            setAnalysisState("complete")
            return
          }
        }
      }

      throw new Error("Analysis timed out after 5 minutes. Please try again.")
    } catch (error) {
      clearInterval(stepAnimationInterval)
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
        <Header onReset={resetInterface} />

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

        {analysisState === "processing" && <ProcessingState currentStep={currentStep} />}

        {analysisState === "complete" && recommendations.length > 0 && (
          <RecommendationsSection
            recommendations={recommendations}
            domain={domain}
            selectedPrompt={selectedPrompt}
            copiedId={copiedId}
            onSelectPrompt={setSelectedPrompt}
            onCopyPrompt={handleCopyPrompt}
            onAddRecommendedPrompt={handleAddRecommendedPrompt}
          />
        )}
      </div>
    </div>
  )
}
