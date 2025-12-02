import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
  maxStreak?: number;
  className?: string;
}

export function StreakCounter({ streak, maxStreak = 0, className = "" }: StreakCounterProps) {
  const isOnFire = streak >= 7;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`
        relative p-3 rounded-xl transition-all duration-300
        ${isOnFire 
          ? 'bg-gradient-to-br from-warning to-accent animate-pulse-scale' 
          : streak > 0 
            ? 'bg-gradient-to-br from-warning/80 to-accent/80' 
            : 'bg-muted/50'
        }
      `}>
        <Flame className={`w-6 h-6 ${streak > 0 ? 'text-white' : 'text-muted-foreground'}`} />
        {isOnFire && (
          <>
            <div className="absolute inset-0 rounded-xl bg-warning/30 animate-ping" />
            <div className="absolute -top-1 -right-1">
              <span className="text-xs">🔥</span>
            </div>
          </>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums">{streak}</p>
        <p className="text-xs text-muted-foreground">
          {streak === 1 ? 'day streak' : 'days streak'}
        </p>
        {maxStreak > streak && (
          <p className="text-xs text-muted-foreground">Best: {maxStreak}</p>
        )}
      </div>
    </div>
  );
}
