"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw, FileText } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HeaderProps {
  onReset: () => void
  onLoadSampleData: () => void
}

export function Header({ onReset, onLoadSampleData }: HeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-[#37352f]">Prompt Analyzer</h1>
        <p className="text-[#787774] text-base leading-6">
          Discover relevant prompts for your domain by analyzing content and comparing with your existing prompts.
        </p>
      </div>
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onLoadSampleData}
                className="h-9 px-3 text-sm font-medium bg-[#2383e2] hover:bg-[#1a6bb8] text-white rounded-md transition-all duration-200"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                Sample Data
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Load sample domain and prompts for testing</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onReset}
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-white hover:bg-[#f7f6f3] text-[#37352f] border border-[#e9e9e7] rounded-md transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear all data and start fresh</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
