export const PROCESSING_STEPS = [
  {
    label: "Initializing Analysis",
    description: "Setting up your analysis session",
    subSteps: ["Validating domain and prompts", "Creating unique session ID", "Establishing database connection"],
  },
  {
    label: "Generating Contextual Prompts",
    description: "Creating AI-optimized prompts for your domain",
    subSteps: [
      "Analyzing your input prompts",
      "Understanding domain context",
      "Generating 10 relevant variations",
      "Optimizing for AI visibility",
    ],
  },
  {
    label: "Analyzing AI Visibility",
    description: "Checking how AI engines respond",
    subSteps: [
      "Querying Perplexity AI",
      "Analyzing Perplexity citations",
      "Querying Google Gemini",
      "Analyzing Gemini citations",
      "Calculating consensus scores",
    ],
  },
  {
    label: "Gathering SEO Metrics",
    description: "Collecting search data from DataForSEO",
    subSteps: [
      "Fetching search volumes",
      "Analyzing keyword difficulty",
      "Gathering CPC data",
      "Checking SERP features",
      "Analyzing trend data",
    ],
  },
  {
    label: "Calculating Opportunity Scores",
    description: "Computing comprehensive scores",
    subSteps: [
      "Weighing AI visibility factors",
      "Calculating SEO opportunity",
      "Generating combined scores",
      "Creating recommendation reasoning",
    ],
  },
  {
    label: "Storing Results",
    description: "Saving analysis to database",
    subSteps: [
      "Storing AI visibility scores",
      "Saving SEO metrics",
      "Recording final scores",
      "Indexing for quick retrieval",
    ],
  },
  {
    label: "Ranking & Filtering",
    description: "Selecting top opportunities",
    subSteps: ["Ranking by combined score", "Filtering top 5 prompts", "Preparing detailed insights"],
  },
  {
    label: "Finalizing Results",
    description: "Preparing your recommendations",
    subSteps: ["Formatting recommendations", "Generating actionable insights", "Preparing visual presentation"],
  },
]

export const STEP_TIMINGS = [5000, 10000, 20000, 15000, 10000, 8000, 7000, 5000]
