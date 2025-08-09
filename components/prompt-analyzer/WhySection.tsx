import type { RecommendedPrompt } from '@/lib/types';

interface WhySectionProps {
  selectedPrompt: RecommendedPrompt | null;
}

export function WhySection({ selectedPrompt }: WhySectionProps) {
  if (!selectedPrompt) return null;

  return (
    <div className="p-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-[#2383e2] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium">?</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#37352f] mb-2">
            Why this prompt is recommended
          </h4>
          <p className="text-sm text-[#787774] leading-relaxed">
            {selectedPrompt.score_reasoning}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-[#9b9a97]">
            <span>Final Score: <span className="font-medium text-[#37352f]">{selectedPrompt.final_score}</span></span>
            <span>AI Score: <span className="font-medium text-[#37352f]">{selectedPrompt.ai_opportunity_score}</span></span>
            <span>SEO Score: <span className="font-medium text-[#37352f]">{selectedPrompt.seo_opportunity_score}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
