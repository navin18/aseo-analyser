import { Loader2 } from 'lucide-react';
import { PROCESSING_STEPS } from '@/lib/constants';

interface ProcessingStateProps {
  currentStep: number;
}

export function ProcessingState({ currentStep }: ProcessingStateProps) {
  return (
    <div className="p-6 bg-[#f7f6f3] border border-[#e9e9e7] rounded-lg animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-[#2383e2] animate-spin" />
          <div className="animate-in fade-in duration-300" key={currentStep}>
            <h4 className="text-sm font-medium text-[#37352f]">
              {PROCESSING_STEPS[currentStep]?.label}
            </h4>
            <p className="text-xs text-[#787774]">
              {PROCESSING_STEPS[currentStep]?.description}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#787774]">
            <span>Processing your request</span>
            <span>{currentStep + 1} of {PROCESSING_STEPS.length}</span>
          </div>
          <div className="w-full bg-[#e9e9e7] rounded-full h-1.5">
            <div
              className="bg-[#2383e2] h-1.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((currentStep + 1) / PROCESSING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
