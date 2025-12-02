import { TrendingUp, IndianRupee } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface SalaryPredictorProps {
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  growth: number;
  className?: string;
}

export function SalaryPredictor({ 
  minSalary, 
  maxSalary, 
  avgSalary,
  growth,
  className = "" 
}: SalaryPredictorProps) {
  const formatSalary = (value: number) => {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    }
    return `${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className={`p-6 rounded-2xl bg-card border border-border/50 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-success" />
          Salary Prediction
        </h4>
        <div className="flex items-center gap-1 text-success text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>+{growth}% YoY</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Expected Range</p>
          <p className="text-3xl font-bold text-gradient">
            ₹<AnimatedCounter end={minSalary / 1000} suffix="K" /> - ₹<AnimatedCounter end={maxSalary / 1000} suffix="K" />
          </p>
        </div>
        
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 bg-gradient-to-r from-success via-primary to-secondary rounded-full"
            style={{ 
              left: `${(minSalary / maxSalary) * 30}%`,
              right: `${100 - ((maxSalary / (maxSalary * 1.3)) * 100)}%`
            }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg"
            style={{ left: `${(avgSalary / (maxSalary * 1.3)) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Entry Level</span>
          <span className="font-medium text-foreground">Avg: ₹{formatSalary(avgSalary)}</span>
          <span>Senior</span>
        </div>
      </div>
    </div>
  );
}
