"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Prompt, AnalysisState } from "@/lib/types"
import { Globe, Sparkles, Plus, FileText, Loader2, AlertCircle, Edit3, Trash2 } from "lucide-react"

interface InputSectionProps {
  domain: string
  onDomainChange: (value: string) => void
  domainError: string
  prompts: Prompt[]
  onAddPrompt: (text: string) => void
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemovePrompt: (id: string) => void
  onUpdatePrompt: (id: string, text: string) => void
  isUploading: boolean
  canGetRecommendations: boolean
  analysisState: AnalysisState
  onGetRecommendations: () => void
}

export function InputSection({
  domain,
  onDomainChange,
  domainError,
  prompts,
  onAddPrompt,
  onFileUpload,
  onRemovePrompt,
  onUpdatePrompt,
  isUploading,
  canGetRecommendations,
  analysisState,
  onGetRecommendations,
}: InputSectionProps) {
  const [promptInput, setPromptInput] = useState("")
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddPrompt = () => {
    if (promptInput.trim()) {
      onAddPrompt(promptInput)
      setPromptInput("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddPrompt()
    }
  }

  const handleEditClick = (promptId: string) => {
    setEditingPromptId(promptId)
    // Use setTimeout to ensure the input is focused after the state update
    setTimeout(() => {
      const input = document.querySelector(`input[data-prompt-id="${promptId}"]`) as HTMLInputElement
      if (input) {
        input.focus()
        // Move cursor to end of text
        input.setSelectionRange(input.value.length, input.value.length)
      }
    }, 0)
  }

  const handleInputBlur = () => {
    setEditingPromptId(null)
  }

  const handleInputKeyPress = (e: React.KeyboardEvent, promptId: string) => {
    if (e.key === "Enter") {
      setEditingPromptId(null)
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <div className="space-y-6">
      {/* Domain Input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#787774]" />
          <h2 className="text-base font-semibold text-[#37352f]">Website Domain</h2>
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Enter domain (e.g., notion.so, stripe.com)"
            value={domain}
            onChange={(e) => onDomainChange(e.target.value)}
            className={cn(
              "h-9 px-3 text-sm bg-white border border-[#e9e9e7] rounded-md focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] focus:outline-none transition-all duration-200",
              domainError && "border-[#eb5757] focus:border-[#eb5757] focus:ring-[#eb5757]",
            )}
          />
          {domainError && (
            <div className="flex items-center gap-2 text-xs text-[#eb5757] animate-in fade-in duration-200">
              <AlertCircle className="w-3 h-3" />
              {domainError}
            </div>
          )}
        </div>
      </div>

      {/* Prompts Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#787774]" />
          <h2 className="text-base font-semibold text-[#37352f]">Your Prompts</h2>
        </div>
        <p className="text-sm text-[#787774]">Add prompts you're currently using or considering</p>

        <div className="space-y-3">
          <Textarea
            placeholder="Enter prompts separated by commas, or type one per line..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[80px] px-3 py-2 text-sm bg-white border border-[#e9e9e7] rounded-md focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] focus:outline-none resize-none transition-all duration-200"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAddPrompt}
              disabled={!promptInput.trim()}
              className="h-8 px-3 text-xs font-medium bg-[#2383e2] hover:bg-[#1a6bb8] text-white border-0 rounded-md disabled:bg-[#e9e9e7] disabled:text-[#9b9a97] transition-all duration-200"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Prompt
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-8 px-3 text-xs font-medium bg-white hover:bg-[#f7f6f3] text-[#37352f] border border-[#e9e9e7] rounded-md transition-all duration-200 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3 mr-1" /> Upload CSV File
                </>
              )}
            </Button>
            <input ref={fileInputRef} type="file" accept=".csv" onChange={onFileUpload} className="hidden" />
          </div>
          <p className="text-xs text-[#9b9a97]">CSV files only, max 5MB. Press Enter to add prompts quickly.</p>
        </div>

        {prompts.length > 0 && (
          <div className="p-4 border border-[#e9e9e7] rounded-md bg-[#fefefe] animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#37352f]">Current Prompts</h3>
              <div className="flex items-center justify-center min-w-[28px] h-6 px-2 bg-[#f7f6f3] text-[#37352f] text-xs font-medium rounded-full border border-[#e9e9e7]">
                {prompts.length}
              </div>
            </div>

            {prompts.length < 5 && (
              <div className="mb-4 p-3 bg-[#fdf2f2] border border-[#eb5757] rounded-md animate-in fade-in duration-300">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#eb5757] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#eb5757]">Add more prompts for better recommendations</p>
                    <p className="text-xs text-[#c9302c] mt-1">We require at least 5 prompts for analysis.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {prompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className="group flex items-center gap-2 px-3 py-2.5 hover:bg-[#f7f6f3] rounded-md transition-all duration-200 animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={prompt.text}
                      data-prompt-id={prompt.id}
                      onChange={(e) => onUpdatePrompt(prompt.id, e.target.value)}
                      onBlur={handleInputBlur}
                      onKeyPress={(e) => handleInputKeyPress(e, prompt.id)}
                      className={cn(
                        "w-full text-sm text-[#37352f] bg-transparent border-none outline-none p-0 leading-5 transition-all duration-200",
                        editingPromptId === prompt.id && "cursor-text",
                      )}
                      readOnly={editingPromptId !== prompt.id}
                    />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(prompt.id)}
                      className="h-6 w-6 p-0 text-[#9b9a97] hover:text-[#37352f] hover:bg-[#e9e9e7] transition-all duration-200"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePrompt(prompt.id)}
                      className="h-6 w-6 p-0 text-[#9b9a97] hover:text-[#eb5757] hover:bg-[#fdf2f2] transition-all duration-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Get Recommendations Button */}
      <div className="flex justify-start pt-2">
        <Button
          onClick={onGetRecommendations}
          disabled={!canGetRecommendations || analysisState === "processing"}
          className="h-9 px-4 text-sm font-medium bg-[#2383e2] hover:bg-[#1a6bb8] text-white border-0 rounded-md disabled:bg-[#e9e9e7] disabled:text-[#9b9a97] transition-all duration-200"
        >
          {analysisState === "processing" ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-1.5" /> Get Recommendations
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
