import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-[#37352f]">Prompt Analyzer</h1>
        <p className="text-[#787774] text-base leading-6">Discover relevant prompts for your domain by analyzing content and comparing with your existing prompts.</p>
      </div>
      <Button
        onClick={onReset}
        variant="outline"
        className="h-9 px-3 text-sm font-medium bg-white hover:bg-[#f7f6f3] text-[#37352f] border border-[#e9e9e7] rounded-md transition-all duration-200"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Start Over
      </Button>
    </div>
  );
}
