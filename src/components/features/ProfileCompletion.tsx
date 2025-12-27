import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  id: string;
  label: string;
  completed: boolean;
}

interface ProfileCompletionProps {
  steps: Step[];
  className?: string;
}

export function ProfileCompletion({ steps, className = "" }: ProfileCompletionProps) {
  const completedCount = steps.filter(s => s.completed).length;
  const percentage = Math.round((completedCount / steps.length) * 100);
  const nextStep = steps.find(s => !s.completed);

  return (
    <div className={`bg-card rounded-xl border border-border p-4 md:p-5 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h4 className="font-semibold text-sm md:text-base text-foreground">Profile Completion</h4>
        <span className={`text-xl md:text-2xl font-bold ${percentage === 100 ? 'text-success' : 'text-primary'}`}>
          {percentage}%
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-4">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Steps list */}
      <div className="space-y-2 mb-4">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
              step.completed ? 'bg-success/5' : 'bg-transparent'
            }`}
          >
            {step.completed ? (
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <span className={`text-sm leading-tight ${
              step.completed 
                ? 'text-muted-foreground line-through' 
                : 'text-foreground'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* CTA Button */}
      {nextStep && (
        <Button 
          size="sm" 
          className="w-full h-9 bg-gradient-primary text-primary-foreground hover:opacity-90 text-xs md:text-sm font-medium"
        >
          <span className="truncate">Complete: {nextStep.label}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5 shrink-0" />
        </Button>
      )}
      
      {percentage === 100 && (
        <div className="text-center py-2">
          <span className="text-sm text-success font-medium">✓ Profile complete!</span>
        </div>
      )}
    </div>
  );
}
