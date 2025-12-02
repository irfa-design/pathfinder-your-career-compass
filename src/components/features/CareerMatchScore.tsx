import { Target, TrendingUp, Sparkles } from "lucide-react";
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

  return (
    <div className={`p-6 rounded-2xl bg-card border border-border/50 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Career Match
        </h4>
        <Badge className={`${score >= 80 ? 'bg-success/10 text-success' : score >= 60 ? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent'} border-0`}>
          {getScoreLabel()}
        </Badge>
      </div>
      
      <div className="flex items-center gap-6">
        <ProgressRing progress={score} size={100} strokeWidth={8}>
          <div className="text-center">
            <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}%</span>
          </div>
        </ProgressRing>
        
        <div className="flex-1">
          <p className="font-medium mb-2">{career}</p>
          <div className="space-y-1">
            {improvements.slice(0, 3).map((item, index) => (
              <p key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
