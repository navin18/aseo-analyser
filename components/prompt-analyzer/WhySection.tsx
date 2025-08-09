import type { RecommendedPrompt } from "@/lib/types"

interface WhySectionProps {
  prompt: RecommendedPrompt
}

export function WhySection({ prompt }: WhySectionProps) {
  return (
    <div className="mt-4 p-4 bg-[#f7f6f3] rounded-lg border border-[#e9e9e7] animate-in fade-in duration-300">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-[#37352f] mb-1">Why this prompt is recommended</h4>
      </div>
      <p className="text-sm text-[#37352f] leading-relaxed mb-4">{prompt.score_reasoning}</p>
      <div className="flex items-center gap-6 pt-3 border-t border-[#e9e9e7]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#787774]">Final Score:</span>
          <span className="text-xs font-semibold text-[#37352f]">{prompt.final_score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#787774]">AI Score:</span>
          <span className="text-xs font-semibold text-[#37352f]">{prompt.ai_opportunity_score}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#787774]">SEO Score:</span>
          <span className="text-xs font-semibold text-[#37352f]">{prompt.seo_opportunity_score}%</span>
        </div>
      </div>
    </div>
  )
}
