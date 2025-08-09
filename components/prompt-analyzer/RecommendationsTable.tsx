"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  Trophy,
  Shield,
  Globe,
  Star,
  Hash,
  FileText,
  Users,
  LayoutIcon,
  Info,
} from "lucide-react"
import { WhySection } from "./WhySection"

// --- PROPS & TYPES ---
interface RecommendationsTableProps {
  recommendations: RecommendedPrompt[]
  selectedPrompt: RecommendedPrompt | null
  copiedId: string | null
  onSelectPrompt: (prompt: RecommendedPrompt | null) => void
  onCopyPrompt: (text: string, id: string) => void
  onAddRecommendedPrompt: (prompt: RecommendedPrompt) => void
}
type View = "overall" | "ai" | "seo"

// --- STYLING HELPERS ---
const getDifficultyBadgeColor = (difficulty: number) => {
  if (difficulty < 30) return "bg-[#e9f5e9] text-[#0f7b0f]"
  if (difficulty < 60) return "bg-[#fef3c7] text-[#b45309]"
  return "bg-[#fdecec] text-[#c81e1e]"
}

// --- SUB-COMPONENTS ---
const BooleanIndicator = ({ value }: { value: boolean }) =>
  value ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-400" />

const SerpFeatures = ({ rec }: { rec: RecommendedPrompt }) => {
  const features = [rec.has_featured_snippet && "FS", rec.has_paa && "PAA", rec.has_ai_overview && "AI"]
    .filter(Boolean)
    .join(", ")
  return <span className="text-sm text-[#787774]">{features || "None"}</span>
}

const PromptCell = ({ prompt }: { prompt: string }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight)
    }
  }, [prompt])

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={showTooltip && isTruncated} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <div ref={textRef} className="text-sm font-semibold text-[#37352f] leading-tight line-clamp-2">
            {prompt}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          className="z-20 p-3 bg-[#37352f] text-white text-sm rounded-lg shadow-lg max-w-md min-w-[300px]"
        >
          <p className="text-sm leading-relaxed">{prompt}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const HeaderCell = ({
  icon: Icon,
  label,
  align = "left",
}: {
  icon?: React.ElementType
  label: string
  align?: "left" | "center"
}) => (
  <div className={cn("flex items-center gap-1.5", align === "center" && "justify-center")}>
    {Icon && <Icon className="w-3.5 h-3.5 text-current" />}
    <span className="whitespace-nowrap">{label}</span>
  </div>
)

// --- MAIN COMPONENT ---
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
    onSelectPrompt(selectedPrompt?.rank === rec.rank ? null : rec)
  }

  const views: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "overall", label: "Overall", icon: <BarChartHorizontal className="w-4 h-4 mr-1.5" /> },
    { id: "ai", label: "AI Scores", icon: <Bot className="w-4 h-4 mr-1.5" /> },
    { id: "seo", label: "SEO Scores", icon: <Sparkles className="w-4 h-4 mr-1.5" /> },
  ]

  const columnConfig = {
    overall: {
      gridClass: "grid-cols-[minmax(0,1fr)_90px_80px_80px_100px_110px_80px_90px]",
      headers: [
        { label: "Prompt" },
        { label: "Score", icon: Trophy, align: "center" },
        { label: "AI", icon: TrendingUp, align: "center" },
        { label: "SEO", icon: Target, align: "center" },
        { label: "Volume", icon: Search, align: "center" },
        { label: "Difficulty", icon: Shield, align: "center" },
        { label: "CPC", icon: DollarSign, align: "center" },
        { label: "Actions", align: "center" },
      ],
    },
    ai: {
      gridClass: "grid-cols-[minmax(0,1fr)_100px_100px_100px_120px_130px_100px_110px]",
      headers: [
        { label: "Prompt" },
        { label: "AI Score", icon: TrendingUp, align: "center" },
        { label: "Perplexity", icon: Globe, align: "center" },
        { label: "Gemini", icon: Star, align: "center" },
        { label: "Citation Rank", icon: Hash, align: "center" },
        { label: "First Para", icon: FileText, align: "center" },
        { label: "Consensus", icon: Users, align: "center" },
        { label: "Total Score", icon: Trophy, align: "center" },
      ],
    },
    seo: {
      gridClass: "grid-cols-[minmax(0,1fr)_100px_120px_100px_90px_100px_140px_110px]",
      headers: [
        { label: "Prompt" },
        { label: "SEO Score", icon: Target, align: "center" },
        { label: "Volume", icon: Search, align: "center" },
        { label: "Difficulty", icon: Shield, align: "center" },
        { label: "CPC", icon: DollarSign, align: "center" },
        { label: "Trend YoY", icon: TrendingUp, align: "center" },
        { label: "SERP Features", icon: LayoutIcon, align: "center" },
        { label: "Total Score", icon: Trophy, align: "center" },
      ],
    },
  }

  const currentConfig = columnConfig[activeView]

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

      {!selectedPrompt && recommendations.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 animate-in fade-in duration-300">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Click any prompt</span> in the table below to see detailed analysis and
            reasoning.
          </p>
        </div>
      )}

      <div className="w-full border border-[#e9e9e7] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {/* Header */}
          <div
            className={cn(
              "grid items-center bg-[#f7f6f3] border-b border-[#e9e9e7] text-xs font-medium text-[#787774]",
              currentConfig.gridClass,
            )}
          >
            {currentConfig.headers.map((header, index) => (
              <div key={index} className="px-4 py-2">
                <HeaderCell {...header} />
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
                  "grid items-center border-b border-[#e9e9e7] group cursor-pointer transition-colors duration-150 min-h-[52px]",
                  currentConfig.gridClass,
                  selectedPrompt?.rank === rec.rank ? "bg-[#e3f2fd]" : "hover:bg-[#f7f6f3]",
                )}
              >
                <div className="px-4 py-3">
                  <PromptCell prompt={rec.prompt_text} />
                </div>
                {activeView === "overall" && (
                  <OverallViewCells {...{ rec, copiedId, onCopyPrompt, onAddRecommendedPrompt }} />
                )}
                {activeView === "ai" && <AiViewCells {...{ rec }} />}
                {activeView === "seo" && <SeoViewCells {...{ rec }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedPrompt && <WhySection prompt={selectedPrompt} />}
    </div>
  )
}

// --- VIEW-SPECIFIC CELL RENDERERS ---
const Cell: React.FC<{ children: React.ReactNode; className?: string; align?: "left" | "center" }> = ({
  children,
  className,
  align = "left",
}) => (
  <div
    className={cn(
      "px-4 py-3 flex items-center text-sm text-[#37352f]",
      align === "center" && "justify-center",
      className,
    )}
  >
    {children}
  </div>
)

const OverallViewCells = ({ rec, copiedId, onCopyPrompt, onAddRecommendedPrompt }: any) => (
  <>
    <Cell align="center" className="font-medium">
      {rec.final_score}
    </Cell>
    <Cell align="center">{rec.ai_opportunity_score}%</Cell>
    <Cell align="center">{rec.seo_opportunity_score}%</Cell>
    <Cell align="center">{rec.search_volume.toLocaleString()}</Cell>
    <Cell align="center">
      <Badge className={cn("border-0 text-xs px-2 py-0.5", getDifficultyBadgeColor(rec.keyword_difficulty))}>
        KD: {rec.keyword_difficulty}
      </Badge>
    </Cell>
    <Cell align="center">${rec.cpc.toFixed(2)}</Cell>
    <Cell align="center">
      <div className="flex items-center gap-1">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>Add to my prompts</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Cell>
  </>
)

const AiViewCells = ({ rec }: { rec: RecommendedPrompt }) => (
  <>
    <Cell align="center">{rec.ai_opportunity_score}%</Cell>
    <Cell align="center">
      <BooleanIndicator value={rec.perplexity_cited} />
    </Cell>
    <Cell align="center">
      <BooleanIndicator value={rec.gemini_cited} />
    </Cell>
    <Cell align="center" className="text-[#787774]">{`P: ${rec.perplexity_citation_rank || "N/A"}, G: ${
      rec.gemini_citation_rank || "N/A"
    }`}</Cell>
    <Cell align="center" className="text-[#787774]">
      {rec.perplexity_first_paragraph && rec.gemini_first_paragraph
        ? "Both"
        : rec.perplexity_first_paragraph
          ? "Perplexity"
          : rec.gemini_first_paragraph
            ? "Gemini"
            : "None"}
    </Cell>
    <Cell align="center">{Math.round(rec.engine_consensus * 100)}%</Cell>
    <Cell align="center" className="font-medium">
      {rec.ai_opportunity_score}
    </Cell>
  </>
)

const SeoViewCells = ({ rec }: { rec: RecommendedPrompt }) => (
  <>
    <Cell align="center">{rec.seo_opportunity_score}%</Cell>
    <Cell align="center">{rec.search_volume.toLocaleString()}</Cell>
    <Cell align="center">
      <Badge className={cn("border-0 text-xs px-2 py-0.5", getDifficultyBadgeColor(rec.keyword_difficulty))}>
        KD: {rec.keyword_difficulty}
      </Badge>
    </Cell>
    <Cell align="center">${rec.cpc.toFixed(2)}</Cell>
    <Cell
      align="center"
      className={cn(
        "font-medium",
        rec.trend_yoy > 0 ? "text-green-600" : rec.trend_yoy < 0 ? "text-red-600" : "text-[#787774]",
      )}
    >
      {rec.trend_yoy > 0 ? "+" : ""}
      {rec.trend_yoy.toFixed(1)}%
    </Cell>
    <Cell align="center">
      <SerpFeatures rec={rec} />
    </Cell>
    <Cell align="center" className="font-medium">
      {rec.seo_opportunity_score}
    </Cell>
  </>
)
