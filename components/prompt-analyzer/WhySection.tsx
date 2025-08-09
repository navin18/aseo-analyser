import type { RecommendedPrompt } from "@/lib/types"
import { Trophy, TrendingUp, Target } from "lucide-react"

interface WhySectionProps {
  prompt: RecommendedPrompt
}

export function WhySection({ prompt }: WhySectionProps) {
  return (
    <div className="mt-4 p-5 bg-[#f7f6f3] rounded-lg border border-[#e9e9e7] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="text-base font-bold text-[#37352f] mb-3 leading-snug">{prompt.prompt_text}</h3>
      <div className="h-px bg-[#e9e9e7] mb-4" />
      <div className="text-xs font-medium text-[#787774] uppercase tracking-wide mb-2">Why Recommended</div>
      <p className="text-sm text-[#37352f] leading-relaxed mb-4">{prompt.score_reasoning}</p>
      <div className="flex items-center gap-6 pt-4 border-t border-[#e9e9e7]">
        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-[#787774]" />
          <span className="text-xs text-[#787774]">Final:</span>
          <span className="text-xs font-bold text-[#37352f]">{prompt.final_score}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-[#787774]" />
          <span className="text-xs text-[#787774]">AI:</span>
          <span className="text-xs font-bold text-[#37352f]">{prompt.ai_opportunity_score}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-[#787774]" />
          <span className="text-xs text-[#787774]">SEO:</span>
          <span className="text-xs font-bold text-[#37352f]">{prompt.seo_opportunity_score}%</span>
        </div>
      </div>
    </div>
  )
}
