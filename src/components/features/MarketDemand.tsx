import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MarketDemandProps {
  demand: "high" | "medium" | "low";
  openings: number;
  trend: "up" | "down" | "stable";
  companies: string[];
  className?: string;
}

const demandConfig = {
  high: {
    color: "text-success",
    bg: "bg-success/10",
    label: "High Demand",
    description: "Excellent job market"
  },
  medium: {
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Moderate Demand",
    description: "Good opportunities available"
  },
  low: {
    color: "text-destructive",
    bg: "bg-destructive/10",
    label: "Low Demand",
    description: "Limited openings"
  }
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus
};

export function MarketDemand({ 
  demand, 
  openings, 
  trend,
  companies,
  className = "" 
}: MarketDemandProps) {
  const config = demandConfig[demand];
  const TrendIcon = trendIcons[trend];

  return (
    <div className={`p-6 rounded-2xl bg-card border border-border/50 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Market Demand
        </h4>
        <Badge className={`${config.bg} ${config.color} border-0`}>
          {config.label}
        </Badge>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{openings.toLocaleString()}+</p>
            <p className="text-sm text-muted-foreground">Open positions</p>
          </div>
          <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
            <TrendIcon className="w-5 h-5" />
            <span className="text-sm font-medium">
              {trend === 'up' ? 'Growing' : trend === 'down' ? 'Declining' : 'Stable'}
            </span>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">Top hiring companies</p>
          <div className="flex flex-wrap gap-2">
            {companies.slice(0, 4).map((company) => (
              <Badge key={company} variant="outline" className="text-xs">
                {company}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
