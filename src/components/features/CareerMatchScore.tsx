import { Target, Sparkles } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { Badge } from "@/components/ui/badge";

interface CareerMatchScoreProps {
  score: number;
  career: string;
  improvements: string[];
  className?: string;
}

export function CareerMatchScore({ score, career, improvements, className = "" }: CareerMatchScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-accent";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Building Match";
  };

  const getBadgeStyles = () => {
    if (score >= 80) return "bg-success/10 text-success border-success/20";
    if (score >= 60) return "bg-warning/10 text-warning border-warning/20";
    return "bg-accent/10 text-accent border-accent/20";
  };

  return (
    <div className={`p-4 md:p-6 rounded-xl bg-card border border-border shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm md:text-base">
          <Target className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
          Career Match
        </h4>
        <Badge className={`${getBadgeStyles()} border text-xs font-medium`}>
          {getScoreLabel()}
        </Badge>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
        <div className="shrink-0">
          <ProgressRing progress={score} size={80} strokeWidth={6}>
            <div className="text-center">
              <span className={`text-lg md:text-xl font-bold ${getScoreColor()}`}>{score}%</span>
            </div>
          </ProgressRing>
        </div>
        
        <div className="flex-1 w-full">
          <p className="font-medium text-foreground mb-2 text-sm md:text-base text-center sm:text-left">
            {career}
          </p>
          <div className="space-y-1.5">
            {improvements.slice(0, 3).map((item, index) => (
              <p key={index} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <Sparkles className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
