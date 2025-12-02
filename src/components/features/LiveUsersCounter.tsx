import { Users } from "lucide-react";
import { useEffect, useState } from "react";

interface LiveUsersCounterProps {
  baseCount?: number;
  className?: string;
}

export function LiveUsersCounter({ baseCount = 1247, className = "" }: LiveUsersCounterProps) {
  const [count, setCount] = useState(baseCount);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live user fluctuation
      const change = Math.floor(Math.random() * 10) - 4;
      setCount((prev) => Math.max(baseCount - 50, prev + change));
    }, 3000);

    return () => clearInterval(interval);
  }, [baseCount]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
        <div className="absolute inset-0 w-3 h-3 bg-success rounded-full animate-ping" />
      </div>
      <Users className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium tabular-nums">{count.toLocaleString()}</span>
      <span className="text-sm text-muted-foreground">online now</span>
    </div>
  );
}
