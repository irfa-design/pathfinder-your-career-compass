import { TrendingUp, Users, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrendingCareer {
  name: string;
  growth: number;
  seekers: number;
  category: string;
}

interface TrendingCareersProps {
  careers: TrendingCareer[];
  className?: string;
}

export function TrendingCareers({ careers, className = "" }: TrendingCareersProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {careers.map((career, index) => (
        <div
          key={career.name}
          className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 card-hover"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{career.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {career.category}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                {career.seekers.toLocaleString()} exploring
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-success">
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold tabular-nums">+{career.growth}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
