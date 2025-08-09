import type { RecommendedPrompt } from "@/lib/types"
import { RecommendationsTable } from "./RecommendationsTable"
import { CheckCircle } from "lucide-react"

interface RecommendationsSectionProps {
  recommendations: RecommendedPrompt[]
  selectedPrompt: RecommendedPrompt | null
  copiedId: string | null
  onSelectPrompt: (prompt: RecommendedPrompt | null) => void
  onCopyPrompt: (text: string, id: string) => void
  onAddRecommendedPrompt: (prompt: RecommendedPrompt) => void
}

export function RecommendationsSection({
  recommendations,
  selectedPrompt,
  copiedId,
  onSelectPrompt,
  onCopyPrompt,
  onAddRecommendedPrompt,
}: RecommendationsSectionProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-[#0f7b0f]" />
        <h2 className="text-base font-semibold text-[#37352f]">Recommended Prompts</h2>
      </div>

      <RecommendationsTable
        recommendations={recommendations}
        selectedPrompt={selectedPrompt}
        copiedId={copiedId}
        onSelectPrompt={onSelectPrompt}
        onCopyPrompt={onCopyPrompt}
        onAddRecommendedPrompt={onAddRecommendedPrompt}
      />
    </div>
  )
}
