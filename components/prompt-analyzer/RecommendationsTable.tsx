"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { RecommendedPrompt } from "@/lib/types"
import {
  Copy,
  Check,
  Plus,
  TrendingUp,
  Target,
  Search,
  DollarSign,
  CheckCircle2,
  XCircle,
  BarChartHorizontal,
  Bot,
  Sparkles,
} from "lucide-react"
import { WhySection } from "./WhySection"

interface RecommendationsTableProps {
  recommendations: RecommendedPrompt[]
  selectedPrompt: RecommendedPrompt | null
  copiedId: string | null
  onSelectPrompt: (prompt: RecommendedPrompt | null) => void
  onCopyPrompt: (text: string, id: string) => void
  onAddRecommendedPrompt: (prompt: RecommendedPrompt) => void
}

type View = "overall" | "ai" | "seo"

const getDifficultyBadgeColor = (difficulty: number) => {
  if (difficulty < 30) return "bg-[#e9f5e9] text-[#0f7b0f]"
  if (difficulty < 60) return "bg-[#fef3c7] text-[#b45309]"
  return "bg-[#fdecec] text-[#c81e1e]"
}

const BooleanIndicator = ({ value }: { value: boolean }) =>
  value ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-gray-400" />

const SerpFeatures = ({ rec }: { rec: RecommendedPrompt }) => {
  const features = [rec.has_featured_snippet && "FS", rec.has_paa && "PAA", rec.has_ai_overview && "AI"]
    .filter(Boolean)
    .join(", ")

  return <span className="text-sm text-[#787774]">{features || "None"}</span>
}

export function RecommendationsTable({
  recommendations,
  selectedPrompt,
  copiedId,
  onSelectPrompt,
  onCopyPrompt,
  onAddRecommendedPrompt,
}: RecommendationsTableProps) {
  const [activeView, setActiveView] = useState<View>("overall")

  const handleRowClick = (rec: RecommendedPrompt) => {
    if (selectedPrompt?.rank === rec.rank) {
      onSelectPrompt(null) // Deselect if clicking the same row
    } else {
      onSelectPrompt(rec)
    }
  }

  const views: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "overall", label: "Overall", icon: <BarChartHorizontal className="w-4 h-4 mr-2" /> },
    { id: "ai", label: "AI Scores", icon: <Bot className="w-4 h-4 mr-2" /> },
    { id: "seo", label: "SEO Scores", icon: <Sparkles className="w-4 h-4 mr-2" /> },
  ]

  const renderTable = () => {
    const headers = {
      overall: [
        "Prompt",
        "Final Score",
        "AI Score",
        "SEO Score",
        "Search Vol",
        "Difficulty",
        "CPC",
        "AI Citations",
        "Actions",
      ],
      ai: [
        "Prompt",
        "AI Score",
        "Perplexity",
        "Gemini",
        "Citation Rank",
        "First Paragraph",
        "Consensus",
        "Total Score",
      ],
      seo: ["Prompt", "SEO Score", "Search Volume", "Difficulty", "CPC", "Trend YoY", "SERP Features", "Total Score"],
    }
    const gridConfig = {
      overall: "grid-cols-[minmax(0,4fr)_repeat(8,minmax(0,1fr))]",
      ai: "grid-cols-[minmax(0,4fr)_repeat(7,minmax(0,1fr))]",
      seo: "grid-cols-[minmax(0,4fr)_repeat(7,minmax(0,1fr))]",
    }

    return (
      <div className="border border-[#e9e9e7] rounded-lg overflow-hidden">
        {/* Header */}
        <div
          className={cn("grid gap-3 items-center p-2 bg-[#f7f6f3] border-b border-[#e9e9e7]", gridConfig[activeView])}
        >
          {headers[activeView].map((header) => (
            <div key={header} className="text-xs font-medium text-[#787774] px-2">
              {header}
            </div>
          ))}
        </div>
        {/* Body */}
        <div>
          {recommendations.map((rec) => (
            <div
              key={rec.rank}
              onClick={() => handleRowClick(rec)}
              className={cn(
                "grid gap-3 items-center border-b border-[#e9e9e7] group cursor-pointer transition-colors duration-150",
                gridConfig[activeView],
                selectedPrompt?.rank === rec.rank ? "bg-[#e3f2fd]" : "hover:bg-[#f7f6f3]",
              )}
            >
              {/* Common Prompt Cell */}
              <div className="p-3 min-w-0">
                <p className="text-sm font-semibold text-[#37352f] leading-snug line-clamp-2">{rec.prompt_text}</p>
              </div>

              {/* View-specific cells */}
              {activeView === "overall" && (
                <OverallViewCells {...{ rec, copiedId, onCopyPrompt, onAddRecommendedPrompt }} />
              )}
              {activeView === "ai" && <AiViewCells {...{ rec }} />}
              {activeView === "seo" && <SeoViewCells {...{ rec }} />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-6 mb-3 border-b border-[#e9e9e7]">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={cn(
              "flex items-center py-2 px-1 text-sm transition-colors duration-150",
              activeView === view.id
                ? "text-[#37352f] font-medium border-b-2 border-[#37352f]"
                : "text-[#787774] hover:text-[#37352f] border-b-2 border-transparent",
            )}
          >
            {view.icon}
            {view.label}
          </button>
        ))}
      </div>
      {renderTable()}
      {selectedPrompt && <WhySection prompt={selectedPrompt} />}
    </div>
  )
}

// Sub-components for cells in each view
const CellWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("px-3 py-2 flex items-center min-w-0", className)}>{children}</div>
)

const OverallViewCells = ({ rec, copiedId, onCopyPrompt, onAddRecommendedPrompt }: any) => (
  <>
    <CellWrapper>
      <div className="inline-flex items-center px-2 py-0.5 bg-[#f1f1ef] rounded text-sm font-medium text-[#37352f]">
        {rec.final_score}
      </div>
    </CellWrapper>
    <CellWrapper>
      <div className="flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5 text-[#787774]" />
        <span className="text-sm text-[#37352f]">{rec.ai_opportunity_score}%</span>
      </div>
    </CellWrapper>
    <CellWrapper>
      <div className="flex items-center gap-1.5">
        <Target className="w-3.5 h-3.5 text-[#787774]" />
        <span className="text-sm text-[#37352f]">{rec.seo_opportunity_score}%</span>
      </div>
    </CellWrapper>
    <CellWrapper>
      <div className="flex items-center gap-1.5">
        <Search className="w-3.5 h-3.5 text-[#787774]" />
        <span className="text-sm text-[#37352f]">{rec.search_volume.toLocaleString()}</span>
      </div>
    </CellWrapper>
    <CellWrapper>
      <Badge className={cn("border-0 text-xs px-2 py-0.5", getDifficultyBadgeColor(rec.keyword_difficulty))}>
        KD: {rec.keyword_difficulty}
      </Badge>
    </CellWrapper>
    <CellWrapper>
      <div className="flex items-center gap-1.5">
        <DollarSign className="w-3.5 h-3.5 text-[#787774]" />
        <span className="text-sm text-[#37352f]">${rec.cpc.toFixed(2)}</span>
      </div>
    </CellWrapper>
    <CellWrapper>
      <span className="text-sm text-[#787774]">
        {rec.perplexity_cited && rec.gemini_cited
          ? "Both"
          : rec.perplexity_cited
            ? "Perplexity"
            : rec.gemini_cited
              ? "Gemini"
              : "None"}
      </span>
    </CellWrapper>
    <CellWrapper>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 p-1 hover:bg-[#e9e9e7] rounded"
          onClick={(e) => {
            e.stopPropagation()
            onCopyPrompt(rec.prompt_text, rec.rank.toString())
          }}
        >
          {copiedId === rec.rank.toString() ? (
            <Check className="w-4 h-4 text-blue-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-[#787774]" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 p-1 hover:bg-[#e9e9e7] rounded"
          onClick={(e) => {
            e.stopPropagation()
            onAddRecommendedPrompt(rec)
          }}
        >
          <Plus className="w-3.5 h-3.5 text-[#787774]" />
        </Button>
      </div>
    </CellWrapper>
  </>
)

const AiViewCells = ({ rec }: { rec: RecommendedPrompt }) => (
  <>
    <CellWrapper>
      <div className="flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5 text-[#787774]" />
        <span className="text-sm text-[#37352f]">{rec.ai_opportunity_score}%</span>
      </div>
    </CellWrapper>
    <CellWrapper>
      <BooleanIndicator value={rec.perplexity_cited} />
    </CellWrapper>
    <CellWrapper>
      <BooleanIndicator value={rec.gemini_cited} />
    </CellWrapper>
    <CellWrapper>
      <span className="text-sm text-[#787774]">
        {`P: ${rec.perplexity_citation_rank || "N/A"}, G: ${rec.gemini_citation_rank || "N/A"}`}
      </span>
    </CellWrapper>
    <CellWrapper>
      <span className="text-sm text-[#787774]">
        {rec.perplexity_first_paragraph && rec.gemini_first_paragraph
          ? "Both"
          : rec.perplexity_first_paragraph
            ? "Perplexity"
            : rec.gemini_first_paragraph
              ? "Gemini"
              : "None"}
      </span>
    </CellWrapper>
    <CellWrapper>
      <span className="text-sm text-[#37352f]">{Math.round(rec.engine_consensus * 100)}%</span>
    </CellWrapper>
    <CellWrapper>
      <div className="inline-flex items-center px-2 py-0.5 bg-[#f1f1ef] rounded text-sm font-medium text-[#37352f]">
        {rec.ai_opportunity_score}
      </div>
    </CellWrapper>
  </>
)

const SeoViewCells = ({ rec }: { rec: RecommendedPrompt }) => (
  <>
    <CellWrapper>
      <div className="flex items-center gap-1.5">
        <Target className="w-3.5 h-3.5 text-[#787774]" />
        <span className="text-sm text-[#37352f]">{rec.seo_opportunity_score}%</span>
      </div>
    </CellWrapper>
    <CellWrapper>
      <div className="flex items-center gap-1.5">
        <Search className="w-3.5 h-3.5 text-[#787774]" />
        <span className="text-sm text-[#37352f]">{rec.search_volume.toLocaleString()}</span>
      </div>
    </CellWrapper>
    <CellWrapper>
      <Badge className={cn("border-0 text-xs px-2 py-0.5", getDifficultyBadgeColor(rec.keyword_difficulty))}>
        KD: {rec.keyword_difficulty}
      </Badge>
    </CellWrapper>
    <CellWrapper>
      <div className="flex items-center gap-1.5">
        <DollarSign className="w-3.5 h-3.5 text-[#787774]" />
        <span className="text-sm text-[#37352f]">${rec.cpc.toFixed(2)}</span>
      </div>
    </CellWrapper>
    <CellWrapper>
      <span
        className={cn(
          "text-sm font-medium",
          rec.trend_yoy > 0 ? "text-green-600" : rec.trend_yoy < 0 ? "text-red-600" : "text-[#787774]",
        )}
      >
        {rec.trend_yoy > 0 ? "+" : ""}
        {rec.trend_yoy.toFixed(1)}%
      </span>
    </CellWrapper>
    <CellWrapper>
      <SerpFeatures rec={rec} />
    </CellWrapper>
    <CellWrapper>
      <div className="inline-flex items-center px-2 py-0.5 bg-[#f1f1ef] rounded text-sm font-medium text-[#37352f]">
        {rec.seo_opportunity_score}
      </div>
    </CellWrapper>
  </>
)
