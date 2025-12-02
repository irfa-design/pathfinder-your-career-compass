import { Crown, Medal, Trophy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar?: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

const rankIcons = [
  { icon: Crown, color: "text-warning" },
  { icon: Medal, color: "text-muted-foreground" },
  { icon: Trophy, color: "text-warning/70" },
];

export function Leaderboard({ entries, className = "" }: LeaderboardProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {entries.map((entry, index) => {
        const RankIcon = rankIcons[index]?.icon;
        const iconColor = rankIcons[index]?.color;
        
        return (
          <div
            key={entry.rank}
            className={`
              flex items-center gap-4 p-3 rounded-xl transition-all duration-300
              ${index === 0 
                ? 'bg-gradient-to-r from-warning/20 to-warning/5 border border-warning/30' 
                : 'bg-card hover:bg-muted/50'
              }
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-8 flex items-center justify-center">
              {RankIcon ? (
                <RankIcon className={`w-5 h-5 ${iconColor}`} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
              )}
            </div>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                {entry.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{entry.name}</p>
              <p className="text-xs text-muted-foreground">Level {entry.level}</p>
            </div>
            <div className="text-right">
              <p className="font-bold tabular-nums">{entry.xp.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
