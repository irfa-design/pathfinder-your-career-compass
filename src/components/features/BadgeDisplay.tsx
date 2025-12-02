import { Trophy, Star, Zap, Target, Award, Crown, Flame, Medal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "star" | "zap" | "target" | "award" | "crown" | "flame" | "medal";
  color: "primary" | "secondary" | "accent" | "success" | "warning";
  earned: boolean;
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  award: Award,
  crown: Crown,
  flame: Flame,
  medal: Medal,
};

const colorMap = {
  primary: "from-primary to-primary/70",
  secondary: "from-secondary to-secondary/70",
  accent: "from-accent to-accent/70",
  success: "from-success to-success/70",
  warning: "from-warning to-warning/70",
};

interface BadgeDisplayProps {
  badges: Badge[];
  className?: string;
}

export function BadgeDisplay({ badges, className = "" }: BadgeDisplayProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {badges.map((badge, index) => {
        const Icon = iconMap[badge.icon];
        return (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <div
                className={`
                  relative p-3 rounded-xl cursor-pointer transition-all duration-300
                  ${badge.earned 
                    ? `bg-gradient-to-br ${colorMap[badge.color]} shadow-lg hover:scale-110 hover:shadow-xl` 
                    : 'bg-muted/50 opacity-40 grayscale'
                  }
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className={`w-6 h-6 ${badge.earned ? 'text-white' : 'text-muted-foreground'}`} />
                {badge.earned && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px]">
              <p className="font-semibold">{badge.name}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              {!badge.earned && <p className="text-xs text-warning mt-1">🔒 Not yet earned</p>}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
