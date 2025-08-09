export interface Prompt {
  id: string;
  text: string;
  category?: string;
}

export interface RecommendedPrompt {
  rank: number;
  prompt_text: string;
  final_score: number;
  ai_opportunity_score: number;
  seo_opportunity_score: number;
  score_reasoning: string;
  perplexity_cited: boolean;
  gemini_cited: boolean;
  perplexity_citation_rank: number;
  gemini_citation_rank: number;
  perplexity_first_paragraph: boolean;
  gemini_first_paragraph: boolean;
  engine_consensus: number;
  search_volume: number;
  keyword_difficulty: number;
  cpc: number;
  trend_yoy: number;
  trend_mom: number;
  has_featured_snippet: boolean;
  has_paa: boolean;
  has_ai_overview: boolean;
  session_id?: string;
}

export type AnalysisState = 'idle' | 'processing' | 'complete';
