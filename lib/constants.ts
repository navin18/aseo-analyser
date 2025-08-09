// lib/constants.ts
export const PROCESSING_STEPS = [
  { label: 'Validating input & creating session', description: 'Initializing analysis session in database' },
  { label: 'Generating relevant prompts', description: 'Creating 10 contextual prompts based on your domain' },
  { label: 'Analyzing AI visibility', description: 'Checking citations in Perplexity and Gemini' },
  { label: 'Gathering SEO metrics', description: 'Analyzing search volume, difficulty, and SERP features' },
  { label: 'Calculating opportunity scores', description: 'Computing AI and SEO opportunity scores' },
  { label: 'Storing analysis results', description: 'Saving all metrics to database' },
  { label: 'Ranking and filtering', description: 'Selecting top 5 prompts by combined score' },
  { label: 'Preparing recommendations', description: 'Formatting final results with reasoning' }
];
