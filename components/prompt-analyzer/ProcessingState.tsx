"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle } from "lucide-react"
import { PROCESSING_STEPS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface ProcessingStateProps {
  currentStep: number
  isAwaitingResults: boolean
}

export function ProcessingState({ currentStep, isAwaitingResults }: ProcessingStateProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [currentSubStep, setCurrentSubStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const lastStepIndex = PROCESSING_STEPS.length - 1
    const currentStepData = PROCESSING_STEPS[currentStep]
    const lastSubStepIndex = (currentStepData?.subSteps?.length || 1) - 1

    if (isAwaitingResults && currentStep === lastStepIndex) {
      setCurrentSubStep(lastSubStepIndex)
      return
    }

    setCurrentSubStep(0)
    if (currentStepData?.subSteps) {
      let subIndex = 0
      const subInterval = setInterval(() => {
        if (subIndex < currentStepData.subSteps.length - 1) {
          subIndex++
          setCurrentSubStep(subIndex)
        } else {
          clearInterval(subInterval)
        }
      }, 3000)

      return () => clearInterval(subInterval)
    }
  }, [currentStep, isAwaitingResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const currentStepData = PROCESSING_STEPS[currentStep]
  const progressPercentage = ((currentStep + 1) / PROCESSING_STEPS.length) * 100

  return (
    <div className="p-6 bg-gradient-to-br from-[#f7f6f3] to-[#f1f1ef] border border-[#e9e9e7] rounded-lg">
      <div className="flex justify-end items-start mb-4">
        <div className="flex items-center gap-2 text-sm text-[#787774] bg-white px-3 py-1 rounded-full border border-[#e9e9e7]">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono font-medium tabular-nums">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold text-[#37352f] mb-1">{currentStepData?.label}</h4>
        <p className="text-sm text-[#787774] mb-3">{currentStepData?.description}</p>

        {currentStepData?.subSteps && (
          <div className="ml-4 space-y-1.5">
            {currentStepData.subSteps.map((subStep, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 text-xs transition-all duration-500",
                  index <= currentSubStep ? "opacity-100" : "opacity-30",
                )}
              >
                {index < currentSubStep ? (
                  <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                ) : index === currentSubStep ? (
                  <div className="w-3 h-3 rounded-full border-2 border-[#2383e2] border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-[#e9e9e7] flex-shrink-0" />
                )}
                <span
                  className={cn(
                    "transition-colors duration-300",
                    index <= currentSubStep ? "text-[#37352f]" : "text-[#9b9a97]",
                  )}
                >
                  {subStep}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 mt-6">
        <div className="flex justify-between text-xs text-[#787774]">
          <span>
            Step {currentStep + 1} of {PROCESSING_STEPS.length}
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="relative w-full bg-[#e9e9e7] rounded-full h-2 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2383e2] to-[#1a6bb8] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
