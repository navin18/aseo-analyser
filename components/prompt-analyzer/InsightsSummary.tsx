export function InsightsSummary() {
  return (
    <div className="p-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-md animate-in fade-in duration-500">
      <h4 className="text-sm font-medium text-[#37352f] mb-2">Key Insights</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#0f7b0f] rounded-full"></div>
          <span className="text-[#787774]">AI opportunity scores show content gap potential</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#2383e2] rounded-full"></div>
          <span className="text-[#787774]">SEO scores indicate search ranking opportunities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#f59e0b] rounded-full"></div>
          <span className="text-[#787774]">Search volume and CPC help prioritize prompts</span>
        </div>
      </div>
    </div>
  );
}
