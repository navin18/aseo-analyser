import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RecommendedPrompt } from '@/lib/types';
import { TrendingUp, Target, Search, BarChart3, Copy, Check, Plus } from 'lucide-react';

interface RecommendationsTableProps {
  recommendations: RecommendedPrompt[];
  selectedPrompt: RecommendedPrompt | null;
  copiedId: string | null;
  onSelectPrompt: (prompt: RecommendedPrompt) => void;
  onCopyPrompt: (text: string, id: string) => void;
  onAddRecommendedPrompt: (prompt: RecommendedPrompt) => void;
}

const getIntentBadgeColor = (difficulty: number) => {
  if (difficulty < 30) return 'bg-[#edfced] text-[#0f7b0f] border-[#d3f5d3]';
  if (difficulty < 60) return 'bg-[#fef3c7] text-[#d97706] border-[#fbbf24]';
  return 'bg-[#fdf2f2] text-[#eb5757] border-[#fca5a5]';
};

export function RecommendationsTable({
  recommendations, selectedPrompt, copiedId, onSelectPrompt, onCopyPrompt, onAddRecommendedPrompt
}: RecommendationsTableProps) {
  return (
    <div className="bg-white border border-[#e9e9e7] rounded-lg overflow-hidden animate-in fade-in duration-500">
      <div className="grid grid-cols-[3.5fr_1.2fr_0.8fr_1fr_1fr_1fr_0.8fr_1.2fr_1fr] gap-3 p-3 bg-[#f7f6f3] border-b border-[#e9e9e7] text-xs font-medium text-[#787774]">
        <div>Prompt</div>
        <div>Score</div>
        <div>Difficulty</div>
        <div>AI Score</div>
        <div>SEO Score</div>
        <div>Search Vol.</div>
        <div>CPC</div>
        <div>AI Citations</div>
        <div>Actions</div>
      </div>
      
      {recommendations.map((rec, index) => (
        <div
          key={rec.rank}
          className={cn(
            "grid grid-cols-[3.5fr_1.2fr_0.8fr_1fr_1fr_1fr_0.8fr_1.2fr_1fr] gap-3 p-3 border-b border-[#e9e9e7] hover:bg-[#f7f6f3] transition-all duration-200 group cursor-pointer animate-in fade-in slide-in-from-bottom-4",
            selectedPrompt?.rank === rec.rank && "bg-[#e3f2fd] border-[#bbdefb]"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => onSelectPrompt(rec)}
        >
          <div className="min-w-0 pr-2"><p className="text-sm text-[#37352f] font-medium leading-tight line-clamp-2">{rec.prompt_text}</p></div>
          <div className="min-w-0"><Badge variant="secondary" className="text-xs px-2 py-1 bg-[#f1f1ef] text-[#787774] border-0 whitespace-nowrap max-w-full truncate">Score: {rec.final_score}</Badge></div>
          <div className="min-w-0"><Badge className={cn("text-xs px-2 py-1 border whitespace-nowrap", getIntentBadgeColor(rec.keyword_difficulty))}>KD: {rec.keyword_difficulty}</Badge></div>
          <div className="min-w-0"><div className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-[#787774] flex-shrink-0" /><span className="text-xs text-[#37352f] truncate">{rec.ai_opportunity_score}%</span></div></div>
          <div className="min-w-0"><div className="flex items-center gap-1"><Target className="w-3 h-3 text-[#787774] flex-shrink-0" /><span className="text-xs text-[#37352f] truncate">{rec.seo_opportunity_score}%</span></div></div>
          <div className="min-w-0"><div className="flex items-center gap-1"><Search className="w-3 h-3 text-[#787774] flex-shrink-0" /><span className="text-xs text-[#37352f] truncate">{rec.search_volume.toLocaleString()}</span></div></div>
          <div className="min-w-0"><div className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-[#787774] flex-shrink-0" /><span className="text-xs font-medium text-[#37352f] truncate">${rec.cpc.toFixed(2)}</span></div></div>
          <div className="min-w-0"><span className="text-xs text-[#9b9a97] truncate block">{rec.perplexity_cited && rec.gemini_cited ? 'Both AI' : rec.perplexity_cited ? 'Perplexity' : rec.gemini_cited ? 'Gemini' : 'None'}</span></div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onCopyPrompt(rec.prompt_text, rec.rank.toString()); }} className="h-6 w-6 p-0 text-[#9b9a97] hover:text-[#37352f] hover:bg-[#e9e9e7] transition-all duration-200">{copiedId === rec.rank.toString() ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}</Button>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onAddRecommendedPrompt(rec); }} className="h-6 w-6 p-0 text-[#9b9a97] hover:text-[#2383e2] hover:bg-[#e3f2fd] transition-all duration-200"><Plus className="w-3 h-3" /></Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
