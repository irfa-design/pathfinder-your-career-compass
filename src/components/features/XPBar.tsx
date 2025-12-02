import { Sparkles } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  levelXP: number;
  level: number;
  className?: string;
}

export function XPBar({ currentXP, levelXP, level, className = "" }: XPBarProps) {
  const progress = (currentXP / levelXP) * 100;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-sm font-bold text-white">{level}</span>
          </div>
          <span className="text-sm font-medium">Level {level}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-warning" />
          <span className="tabular-nums">{currentXP.toLocaleString()}</span>
          <span>/</span>
          <span className="tabular-nums">{levelXP.toLocaleString()} XP</span>
        </div>
      </div>
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
      </div>
    </div>
  );
}
