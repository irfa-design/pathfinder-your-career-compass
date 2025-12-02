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
    <div className={`p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold">Profile Completion</h4>
        <span className="text-2xl font-bold text-gradient">{percentage}%</span>
      </div>
      
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-4">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="space-y-2 mb-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-2">
            {step.completed ? (
              <CheckCircle2 className="w-4 h-4 text-success" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground" />
            )}
            <span className={`text-sm ${step.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      {nextStep && (
        <Button size="sm" className="w-full bg-gradient-primary">
          Complete: {nextStep.label}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
