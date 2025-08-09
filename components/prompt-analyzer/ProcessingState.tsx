"use client"

import { useState, useEffect } from "react"
import { Loader2, Clock } from "lucide-react"
import { PROCESSING_STEPS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface ProcessingStateProps {
  currentStep: number
}

export function ProcessingState({ currentStep }: ProcessingStateProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const progressPercentage = ((currentStep + 1) / PROCESSING_STEPS.length) * 100

  return (
    <div className="p-6 bg-gradient-to-r from-[#f7f6f3] to-[#f1f1ef] border border-[#e9e9e7] rounded-lg animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Loader2 className="w-5 h-5 text-[#2383e2] animate-spin" />
            <div className="absolute inset-0 w-5 h-5 bg-[#2383e2] opacity-20 blur-sm animate-pulse" />
          </div>
          <span className="text-sm font-medium text-[#787774]">Processing</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#787774]">
          <Clock className="w-4 h-4" />
          <span className="font-mono tabular-nums">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      <div className="mb-4 min-h-[60px]">
        <div className="animate-in fade-in slide-in-from-left-2 duration-500" key={currentStep}>
          <h4 className="text-base font-semibold text-[#37352f] mb-1">{PROCESSING_STEPS[currentStep]?.label}</h4>
          <p className="text-sm text-[#787774]">{PROCESSING_STEPS[currentStep]?.description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[#787774]">
          <span>
            Step {currentStep + 1} of {PROCESSING_STEPS.length}
          </span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
        <div className="relative w-full bg-[#e9e9e7] rounded-full h-2 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2383e2] to-[#1a6bb8] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-shimmer" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        {PROCESSING_STEPS.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index < currentStep
                ? "bg-[#2383e2]"
                : index === currentStep
                  ? "bg-[#2383e2] animate-pulse"
                  : "bg-[#e9e9e7]",
            )}
          />
        ))}
      </div>
    </div>
  )
}
