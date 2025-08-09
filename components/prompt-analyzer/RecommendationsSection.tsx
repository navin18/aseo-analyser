import { CheckCircle } from 'lucide-react';
import type { RecommendedPrompt } from '@/lib/types';
import { RecommendationsTable } from './RecommendationsTable';
import { WhySection } from './WhySection';
import { InsightsSummary } from './InsightsSummary';

interface RecommendationsSectionProps {
  recommendations: RecommendedPrompt[];
  domain: string;
  selectedPrompt: RecommendedPrompt | null;
  copiedId: string | null;
  onSelectPrompt: (prompt: RecommendedPrompt) => void;
  onCopyPrompt: (text: string, id: string) => void;
  onAddRecommendedPrompt: (prompt: RecommendedPrompt) => void;
}

export function RecommendationsSection({
  recommendations, domain, selectedPrompt, copiedId, onSelectPrompt, onCopyPrompt, onAddRecommendedPrompt
}: RecommendationsSectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-[#0f7b0f]" />
        <h2 className="text-base font-semibold text-[#37352f]">Recommended Prompts</h2>
      </div>
      <p className="text-sm text-[#787774] -mt-2">
        Based on analysis of {domain}, here are the top prompts with detailed insights. Click any prompt to see why it's recommended.
      </p>
      
      <RecommendationsTable
        recommendations={recommendations}
        selectedPrompt={selectedPrompt}
        copiedId={copiedId}
        onSelectPrompt={onSelectPrompt}
        onCopyPrompt={onCopyPrompt}
        onAddRecommendedPrompt={onAddRecommendedPrompt}
      />

      <WhySection selectedPrompt={selectedPrompt} />
      <InsightsSummary />
    </div>
  );
}
